import {
  createHelpCenterArticle,
  listHelpCenterArticles,
  type HelpCenterListFilters,
} from '../../help-center/service.js';
import { ensureAdminRequest, parseJsonBody } from '../../help-center/admin-utils.js';

type AnyRequest = {
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
  headers?: Record<string, string | undefined>;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (name: string, value: string) => void;
  end?: (body?: any) => void;
};

const ALLOWED_SORTS = new Set(['recent', 'popular']);

function applyCors(res: AnyResponse) {
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseQueryString(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
}

function parseFilters(query: Record<string, string | string[]> = {}): HelpCenterListFilters {
  const filters: HelpCenterListFilters = {};

  const search = parseQueryString(query.q || query.search);
  if (search) filters.search = search;

  const category = parseQueryString(query.category);
  if (category) filters.category = category;

  const type = parseQueryString(query.type);
  if (type) filters.type = type as HelpCenterListFilters['type'];

  const difficulty = parseQueryString(query.difficulty);
  if (difficulty) filters.difficulty = difficulty as HelpCenterListFilters['difficulty'];

  const tag = parseQueryString(query.tag);
  if (tag) filters.tag = tag;

  const sort = parseQueryString(query.sort);
  const normalizedSort = (sort || '').toLowerCase();
  filters.sort = ALLOWED_SORTS.has(normalizedSort) ? (normalizedSort as 'recent' | 'popular') : 'recent';

  const page = parseQueryString(query.page);
  if (page) filters.page = Number(page);

  const pageSize = parseQueryString(query.pageSize || query.limit);
  if (pageSize) filters.pageSize = Number(pageSize);

  return filters;
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status?.(204);
    res.end?.();
    return;
  }

  if (req.method === 'GET') {
    try {
      const filters = parseFilters(req.query);
      const result = await listHelpCenterArticles(filters);
      res.status?.(200);
      res.json?.(result);
    } catch (error: any) {
      console.error('[help-center] list error', error);
      res.status?.(500);
      res.json?.({ error: error?.message || 'Failed to load help center articles' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      ensureAdminRequest(req);
      const body = await parseJsonBody(req);
      const created = await createHelpCenterArticle(body);
      res.status?.(201);
      res.json?.(created);
    } catch (error: any) {
      const status = error?.statusCode || 500;
      console.error('[help-center] create error', error);
      res.status?.(status);
      res.json?.({ error: error?.message || 'Failed to create article' });
    }
    return;
  }

  res.status?.(405);
  res.json?.({ error: 'Method not allowed' });
}
