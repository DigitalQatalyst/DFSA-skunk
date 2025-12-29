/**
 * Catch-all route for /api/documents/:id/* paths
 * Handles:
 * - GET /api/documents/:id
 * - DELETE /api/documents/:id
 * - GET /api/documents/:id/versions
 * - POST /api/documents/:id/versions
 */

import { handleGetDocument, handleDeleteDocument, handleGetDocumentVersions, handleCreateDocumentVersion } from '../../middleware/documents.js';

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

export default async function handler(req: AnyRequest, res: AnyResponse): Promise<void> {
  // CORS headers
  res.setHeader?.('Access-Control-Allow-Origin', '*');
  res.setHeader?.('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status?.(200);
    res.end?.();
    return;
  }

  try {
    // Extract document ID from query
    const documentId = Array.isArray(req.query?.id) 
      ? req.query.id[0] 
      : req.query?.id as string;

    if (!documentId) {
      res.status?.(400);
      res.json?.({ error: 'Document ID is required' });
      return;
    }

    // Extract path segments from catch-all parameter
    const path = Array.isArray(req.query?.path) 
      ? req.query.path 
      : req.query?.path 
        ? [req.query.path as string]
        : [];

    // Check if this is a versions request
    const isVersionsRequest = path.length > 0 && path[0] === 'versions';

    if (isVersionsRequest) {
      // Handle versions routes
      if (req.method === 'GET') {
        await handleGetDocumentVersions(req, res, documentId);
      } else if (req.method === 'POST') {
        await handleCreateDocumentVersion(req, res, documentId);
      } else {
        res.status?.(405);
        res.json?.({ error: 'Method not allowed' });
      }
    } else if (path.length === 0) {
      // Handle document routes (no additional path segments)
      if (req.method === 'GET') {
        await handleGetDocument(req, res, documentId);
      } else if (req.method === 'DELETE') {
        await handleDeleteDocument(req, res, documentId);
      } else {
        res.status?.(405);
        res.json?.({ error: 'Method not allowed' });
      }
    } else {
      // Unknown path - return 404
      res.status?.(404);
      res.json?.({ error: 'Not found' });
    }
  } catch (error: any) {
    console.error('API error:', error);
    res.status?.(500);
    res.json?.({ error: error.message || 'Internal server error' });
  }
}

