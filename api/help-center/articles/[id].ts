import {
  deleteHelpCenterArticle,
  getHelpCenterArticleById,
  incrementArticleViewCount,
  updateHelpCenterArticle,
} from '../../help-center/service.js';
import { ensureAdminRequest, parseJsonBody } from '../../help-center/admin-utils.js';

type AnyRequest = {
  method?: string;
  query?: Record<string, string | string[]>;
  headers?: Record<string, string | undefined>;
  body?: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (name: string, value: string) => void;
  end?: (body?: any) => void;
};

function applyCors(res: AnyResponse) {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function extractId(query: Record<string, string | string[]> = {}): string | null {
  const value = query.id;
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status?.(204);
    res.end?.();
    return;
  }

  const id = extractId(req.query);
  if (!id) {
    res.status?.(400);
    res.json?.({ error: 'id is required' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const article = await getHelpCenterArticleById(id);
      if (!article) {
        res.status?.(404);
        res.json?.({ error: 'Article not found' });
        return;
      }
      incrementArticleViewCount(id).catch((err) =>
        console.warn('[help-center] increment view failed', err),
      );
      res.status?.(200);
      res.json?.(article);
    } catch (error: any) {
      console.error('[help-center] detail error', error);
      res.status?.(500);
      res.json?.({ error: error?.message || 'Failed to fetch article' });
    }
    return;
  }

  if (req.method === 'PATCH' || req.method === 'DELETE') {
    try {
      ensureAdminRequest(req);
      if (req.method === 'PATCH') {
        const body = await parseJsonBody(req);
        const updated = await updateHelpCenterArticle(id, body);
        res.status?.(200);
        res.json?.(updated);
        return;
      }
      await deleteHelpCenterArticle(id);
      res.status?.(204);
      res.end?.();
    } catch (error: any) {
      const status = error?.statusCode || 500;
      console.error('[help-center] mutation error', error);
      res.status?.(status);
      res.json?.({ error: error?.message || 'Failed to update article' });
    }
    return;
  }

  res.status?.(405);
  res.json?.({ error: 'Method not allowed' });
}
