import { createClient } from '@supabase/supabase-js'

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }
  try {
    const body = await parseBody(req)
    const mediaId = String(body?.mediaId || '').trim()
    if (!mediaId) {
      res.statusCode = 400
      res.setHeader('Content-Type','application/json')
      return res.end(JSON.stringify({ error: 'mediaId required' }))
    }
    const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      res.statusCode = 401
      res.setHeader('Content-Type','application/json')
      return res.end(JSON.stringify({ error: 'Supabase service key not configured' }))
    }
    const supabase = createClient(url, serviceKey)
    const { error } = await supabase.from('media_views').insert([{ media_id: mediaId }])
    if (error) throw error
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ ok: true }))
  } catch (e) {
    console.warn('track-view failed', e)
    res.statusCode = 200 // do not block page on tracking failures
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ ok: false }))
  }
}

