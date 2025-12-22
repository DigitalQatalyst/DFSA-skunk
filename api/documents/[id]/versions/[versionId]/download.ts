/**
 * GET /api/documents/:id/versions/:versionId/download
 * Download version route using middleware
 */

import { handleDownloadVersion } from '../../../../middleware/documents.js';

// Vercel serverless functions don't use Next.js config pattern
// Body parsing is handled automatically by Vercel for JSON requests

type AnyRequest = {
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
  headers: Record<string, string | undefined>;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  // CORS headers
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status?.(200);
    res.end?.();
    return;
  }

  try {
    if (req.method !== 'GET') {
      res.status?.(405);
      res.json?.({ error: 'Method not allowed' });
      return;
    }

    // Extract document ID and version ID from query or URL
    const documentId = Array.isArray(req.query?.id) 
      ? req.query.id[0] 
      : req.query?.id as string;
    
    const versionId = Array.isArray(req.query?.versionId) 
      ? req.query.versionId[0] 
      : req.query?.versionId as string;

    if (!documentId || !versionId) {
      res.status?.(400);
      res.json?.({ error: 'Document ID and Version ID are required' });
      return;
    }

    await handleDownloadVersion(req, res, documentId, versionId);
  } catch (error: any) {
    console.error('API error:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Internal server error' });
  }
}

