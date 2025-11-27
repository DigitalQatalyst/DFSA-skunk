import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'pg';
import * as ts from 'typescript';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HELP_CENTER_FILE = path.resolve(__dirname, '../src/components/HelpCenter/HelpCenterPage.tsx');
const CONNECTION_STRING = 'postgresql://postgres.nywlgmvnpaeemyxlhttx:DQatalyst%402025%21@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

function evaluateNode(node) {
  if (!node) return undefined;

  switch (node.kind) {
    case ts.SyntaxKind.ObjectLiteralExpression: {
      const result = {};
      node.properties.forEach((prop) => {
        if (ts.isPropertyAssignment(prop)) {
          const key = prop.name.getText();
          result[key] = evaluateNode(prop.initializer);
        } else if (ts.isShorthandPropertyAssignment(prop)) {
          result[prop.name.getText()] = evaluateNode(prop.name);
        } else if (ts.isSpreadAssignment(prop)) {
          Object.assign(result, evaluateNode(prop.expression));
        }
      });
      return result;
    }
    case ts.SyntaxKind.ArrayLiteralExpression:
      return node.elements.map((el) => evaluateNode(el));
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      return node.text;
    case ts.SyntaxKind.NumericLiteral:
      return Number(node.text);
    case ts.SyntaxKind.TrueKeyword:
      return true;
    case ts.SyntaxKind.FalseKeyword:
      return false;
    case ts.SyntaxKind.NullKeyword:
      return null;
    case ts.SyntaxKind.UndefinedKeyword:
      return undefined;
    case ts.SyntaxKind.AsExpression:
    case ts.SyntaxKind.TypeAssertionExpression:
      return evaluateNode(node.expression);
    default:
      throw new Error(`Unsupported syntax node: ${ts.SyntaxKind[node.kind]}`);
  }
}

function extractMockArticles() {
  const fileContent = fs.readFileSync(HELP_CENTER_FILE, 'utf8');
  const source = ts.createSourceFile('HelpCenterPage.tsx', fileContent, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);

  let articles = null;

  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText() === 'mockHelpArticles') {
      articles = evaluateNode(node.initializer);
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(source);

  if (!Array.isArray(articles)) {
    throw new Error('Unable to extract mockHelpArticles array');
  }

  return articles;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const iso = `${dateStr}T00:00:00Z`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapArticleToRow(article) {
  const typeMapping = {
    Guide: { contentType: 'Article', contentSubtype: 'guide' },
    FAQ: { contentType: 'Article', contentSubtype: 'faq' },
    Walkthrough: { contentType: 'Article', contentSubtype: 'walkthrough' },
    Video: { contentType: 'Video', contentSubtype: 'walkthrough' },
  };

  const mapping = typeMapping[article.type] || typeMapping.Guide;
  const publishedAt = parseDate(article.lastUpdated) || new Date();

  const metadata = {
    hc_type: article.type,
    hc_difficulty: article.difficulty,
    hc_steps: article.steps || [],
    hc_resources: article.resources || [],
    hc_helpful: article.helpful || 0,
    hc_last_updated: article.lastUpdated,
    hc_seed: 'mock-data',
  };

  if (article.videoUrl) {
    metadata.hc_video_url = article.videoUrl;
  }

  return {
    id: randomUUID(),
    title: article.title,
    content_type: mapping.contentType,
    content_subtype: mapping.contentSubtype,
    summary: article.description,
    description: article.description,
    content: article.content || article.description,
    category: article.category,
    tags: article.tags || [],
    read_time: article.readTime || null,
    view_count: article.views || 0,
    content_url: article.videoUrl || null,
    metadata,
    status: 'Published',
    published_at: publishedAt,
    created_at: publishedAt,
    updated_at: publishedAt,
  };
}

async function seedHelpCenter() {
  const articles = extractMockArticles();
  const rows = articles.map(mapArticleToRow);

  const client = new Client({ connectionString: CONNECTION_STRING });
  await client.connect();

  try {
    await client.query(`DELETE FROM cnt_contents WHERE metadata->>'hc_seed' = 'mock-data'`);

    for (const row of rows) {
      await client.query(
        `INSERT INTO cnt_contents (
          id, title, content_type, content_subtype, summary, description, content, category,
          tags, read_time, view_count, content_url, metadata, status, published_at, created_at, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,
          $9,$10,$11,$12,$13,$14,$15,$16,$17
        )`,
        [
          row.id,
          row.title,
          row.content_type,
          row.content_subtype,
          row.summary,
          row.description,
          row.content,
          row.category,
          row.tags,
          row.read_time,
          row.view_count,
          row.content_url,
          row.metadata,
          row.status,
          row.published_at,
          row.created_at,
          row.updated_at,
        ],
      );
    }
  } finally {
    await client.end();
  }

  console.log(`Seeded ${rows.length} help center articles into cnt_contents.`);
}

seedHelpCenter().catch((err) => {
  console.error('Failed to seed help center articles:', err);
  process.exit(1);
});
