import { updateHelpfulCount } from '../../../help-center/service.js';

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
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function extractId(query: Record<string, string | string[]> = {}): string | null {
  const value = query.id;
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

async function getBody(req: AnyRequest) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.status?.(204);
    res.end?.();
    return;
  }

  if (req.method !== 'POST') {
    res.status?.(405);
    res.json?.({ error: 'Method not allowed' });
    return;
  }

  const id = extractId(req.query);
  if (!id) {
    res.status?.(400);
    res.json?.({ error: 'id is required' });
    return;
  }

  try {
    const body = await getBody(req);
    let delta = 1;
    if (typeof body?.delta === 'number' && Number.isFinite(body.delta)) {
      delta = Math.sign(body.delta) || 1;
    } else if (body?.action === 'decrement') {
      delta = -1;
    }

    const helpful = await updateHelpfulCount(id, delta);
    res.status?.(200);
    res.json?.({ helpful });
  } catch (error: any) {
    console.error('[help-center] helpful error', error);
    res.status?.(500);
    res.json?.({ error: error?.message || 'Failed to update helpful count' });
  }
}
