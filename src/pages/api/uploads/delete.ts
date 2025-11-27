import type { IncomingMessage, ServerResponse } from 'http'
import { deleteBlob } from '../../../server/azure/blobSign'

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req: IncomingMessage & { method?: string }, res: ServerResponse & { statusCode: number; setHeader: Function; end: Function }) {
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Content-Type','application/json'); return res.end(JSON.stringify({ error: 'Method not allowed' })) }

  try {
    const account = process.env.AZURE_STORAGE_ACCOUNT
    const container = process.env.AZURE_STORAGE_CONTAINER
    const key = process.env.AZURE_STORAGE_ACCOUNT_KEY
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!account || (!key && !conn) || !container) {
      res.statusCode = 401
      res.setHeader('Content-Type','application/json')
      return res.end(JSON.stringify({ error: 'Storage not configured' }))
    }

    const body = await parseBody(req)
    const { blobPath } = body || {}
    if (!blobPath || typeof blobPath !== 'string') {
      res.statusCode = 400
      res.setHeader('Content-Type','application/json')
      return res.end(JSON.stringify({ error: 'blobPath is required' }))
    }

    await deleteBlob(blobPath)
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ ok: true }))
  } catch (e: any) {
    res.statusCode = 500
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ error: e?.message || 'Failed to delete blob' }))
  }
}