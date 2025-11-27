// api/admin/taxonomy/index.js
import { createClient } from '@supabase/supabase-js'

// ---------- shared helpers ----------
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

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Supabase service key not configured')
  return createClient(url, serviceKey)
}

const slugify = (s) => String(s || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

// ---------- actions ----------
async function doCreate(body) {
  const supabase = getSupabase()
  const {
    label,
    key: keyRaw,
    description = null,
    position = 0,
    kind: rawKind = 'Domain',
    archived = false,
    allowedMediaTypes
  } = body || {}

  if (!label || typeof label !== 'string' || !label.trim()) {
    throw new Error('label is required')
  }

  const key = slugify(keyRaw || label)
  const kind = String(rawKind || 'Domain')
  let allowed_media_types = null

  // For Format, enforce scoping (array of canonical media type names)
  if (kind === 'Format') {
    const arr = Array.isArray(allowedMediaTypes)
      ? allowedMediaTypes.map((s) => String(s)).filter(Boolean)
      : []
    if (!archived && arr.length === 0) {
      throw new Error('allowed_media_types required for non-archived Format')
    }
    allowed_media_types = JSON.stringify(arr)
  }

  const { data, error } = await supabase
    .from('taxonomies')
    .insert([{
      kind,
      label: label.trim(),
      key,
      description,
      position: Number(position) || 0,
      archived: !!archived,
      allowed_media_types
    }])
    .select('id')
    .single()

  if (error) throw error
  return { ok: true, id: data?.id }
}

async function doUpdate(body) {
  const supabase = getSupabase()
  const { id, patch = {} } = body || {}
  if (!id) throw new Error('id is required')

  const allowed = {}
  if (typeof patch.label === 'string') allowed.label = patch.label
  if (typeof patch.key === 'string') allowed.key = slugify(patch.key)
  if ('description' in patch) allowed.description = patch.description ?? null
  if (typeof patch.position === 'number') allowed.position = patch.position
  if (typeof patch.archived === 'boolean') allowed.archived = patch.archived
  if (Array.isArray(patch.allowedMediaTypes)) {
    allowed.allowed_media_types = JSON.stringify(
      patch.allowedMediaTypes.map((s) => String(s)).filter(Boolean)
    )
  }
  if (typeof patch.kind === 'string') {
    // allow kind update if you want; otherwise omit this line
    allowed.kind = patch.kind
  }

  const { error } = await supabase.from('taxonomies').update(allowed).eq('id', id)
  if (error) throw error
  return { ok: true }
}

async function doArchive(body) {
  const supabase = getSupabase()
  const { id, archived } = body || {}
  if (!id || typeof archived !== 'boolean') {
    throw new Error('id and archived are required')
  }
  const { error } = await supabase.from('taxonomies').update({ archived }).eq('id', id)
  if (error) throw error
  return { ok: true }
}

async function doReorder(body) {
  const supabase = getSupabase()
  const { order } = body || {}
  if (!Array.isArray(order) || order.length === 0) {
    throw new Error('order array required')
  }
  // Simple sequential updates; for large lists you could batch using RPC
  for (let i = 0; i < order.length; i++) {
    const id = order[i]
    if (!id) continue
    const { error } = await supabase.from('taxonomies').update({ position: i }).eq('id', id)
    if (error) throw error
  }
  return { ok: true }
}

// ---------- main handler ----------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  try {
    const body = await parseBody(req)
    const action = String((req.query?.action || body?.action || '')).toLowerCase()

    let result
    if (action === 'create') result = await doCreate(body)
    else if (action === 'update') result = await doUpdate(body)
    else if (action === 'archive') result = await doArchive(body)
    else if (action === 'reorder') result = await doReorder(body)
    else throw new Error('Unsupported action. Use one of: create, update, archive, reorder')

    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify(result))
  } catch (e) {
    res.statusCode = 500
    res.setHeader('Content-Type','application/json')
    return res.end(JSON.stringify({ error: e?.message || 'Request failed' }))
  }
}
