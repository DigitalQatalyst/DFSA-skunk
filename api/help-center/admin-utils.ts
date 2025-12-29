import { extractUserRoleFromToken } from '../middleware/business-logic.js';

const ADMIN_ROLES = new Set(['admin', 'content_manager', 'content-manager', 'editor']);

type RequestHeaders = Record<string, string | undefined>;

export type RequestLike = {
  headers?: RequestHeaders;
  body?: any;
};

function getAuthToken(headers?: RequestHeaders): string | null {
  if (!headers) return null;
  const raw = headers.authorization || headers.Authorization;
  if (!raw) return null;
  if (raw.startsWith('Bearer ')) return raw.slice(7).trim();
  return raw.trim();
}

export function ensureAdminRequest(req: RequestLike) {
  const token = getAuthToken(req.headers);
  if (!token) {
    const error: any = new Error('Unauthorized');
    error.statusCode = 401;
    throw error;
  }
  const role = extractUserRoleFromToken(token);
  if (!role || !ADMIN_ROLES.has(role.toLowerCase())) {
    const error: any = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
}

export async function parseJsonBody(req: RequestLike) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}
