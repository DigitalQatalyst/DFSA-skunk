/**
 * GET /api/documents
 * POST /api/documents
 * Main document routes using middleware
 */

import { handleGetDocuments, handleCreateDocument } from '../middleware/documents.js';

// Vercel serverless functions don't use Next.js config pattern
// For multipart/form-data, parsing is handled in middleware

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

// Vercel serverless function handler
export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  console.log('📥 [api/documents/index.ts] Request received:', {
    method: req.method,
    url: req.url,
  });
  
  // CORS headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    if (res.status) res.status(200);
    if (res.end) res.end();
    return;
  }

  try {
    if (req.method === 'GET') {
      console.log('📥 [api/documents] Handling GET request');
      await handleGetDocuments(req, res);
    } else if (req.method === 'POST') {
      console.log('📥 [api/documents] Handling POST request');
      await handleCreateDocument(req, res);
    } else {
      console.log('❌ [api/documents] Method not allowed:', req.method);
      if (res.status) res.status(405);
      if (res.json) res.json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('❌ [api/documents] API error:', error);
    if (res.status) res.status(500);
    if (res.json) res.json({ error: error.message || 'Internal server error' });
  }
}


