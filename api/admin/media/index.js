// api/admin/media/index.js
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
  const url =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('Supabase service key not configured')
  return createClient(url, serviceKey)
}

function canonTypeStr(typeLike) {
  const t = String(typeLike || '').toLowerCase()
  if (t === 'news') return 'News'
  if (t === 'report' || t === 'reports') return 'Report'
  if (['tool', 'tools', 'toolkit', 'toolkits', 'toolkits & templates'].includes(t)) return 'Tool'
  if (t === 'guide' || t === 'guides' || t === 'article' || t === 'articles') return 'Article'
  if (t === 'event' || t === 'events') return 'Event'
  if (t === 'video' || t === 'videos') return 'Video'
  if (t === 'podcast' || t === 'podcasts') return 'Podcast'
  return ''
}

async function validateFormatAndPopularity(supabase, fmt, pop, canonType) {
  // Format
  if (fmt) {
    const { data: fmtRow, error: fmtErr } = await supabase
      .from('taxonomies')
      .select('id, allowed_media_types, archived')
      .eq('kind', 'Format')
      .eq('label', fmt)
      .limit(1)
      .single()
    if (fmtErr || !fmtRow || fmtRow.archived) {
      throw new Error(`Invalid format "${fmt}"`)
    }
    const allowed = Array.isArray(fmtRow.allowed_media_types) ? fmtRow.allowed_media_types : []
    if (canonType && allowed.length > 0 && !allowed.includes(canonType)) {
      throw new Error(`Format "${fmt}" not allowed for type "${canonType}"`)
    }
  }

  // Popularity
  if (pop) {
    const { data: popRow } = await supabase
      .from('taxonomies')
      .select('id, archived')
      .eq('kind', 'Popularity')
      .eq('label', pop)
      .limit(1)
      .maybeSingle()
    if (!popRow || popRow.archived) {
      throw new Error(`Invalid popularity "${pop}"`)
    }
  }
}

async function assignDomainMapping(supabase, id, domainLabel) {
  try {
    const { data: domTax, error: taxErr } = await supabase
      .from('taxonomies')
      .select('id,label,key')
      .eq('kind', 'Domain')
    if (taxErr || !Array.isArray(domTax)) return

    const domainIds = domTax.map((t) => t.id)
    if (domainIds.length > 0) {
      await supabase.from('media_taxonomies').delete().eq('media_id', id).in('taxonomy_id', domainIds)
    }

    if (domainLabel) {
      const key = String(domainLabel).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const match = domTax.find((t) => t.label === domainLabel) || domTax.find((t) => t.key === key)
      if (match) {
        const { error: mapErr } = await supabase
          .from('media_taxonomies')
          .insert([{ media_id: id, taxonomy_id: match.id }])
        if (mapErr && String(mapErr.code) !== '23505') {
          console.warn('Failed to map media to taxonomy', { id, taxId: match.id, mapErr })
        }
      }
    }
  } catch (e) {
    console.warn('Category mapping update failed', e)
  }
}

async function upsertChildTable(supabase, t, id, child, mode) {
  const lower = (t || '').toLowerCase()
  const exec = (table, payload) =>
    mode === 'insert'
      ? supabase.from(table).insert([payload])
      : supabase.from(table).upsert([payload], { onConflict: 'id' })

  if (['article', 'news', 'guide'].includes(lower)) {
    return exec('articles', { id, ...child })
  } else if (['video', 'videos'].includes(lower)) {
    return exec('videos', { id, ...child })
  } else if (['podcast', 'podcasts'].includes(lower)) {
    return exec('podcasts', { id, ...child })
  } else if (['report', 'reports'].includes(lower)) {
    return exec('reports', { id, ...child })
  } else if (['tool', 'tools', 'toolkit', 'toolkits', 'toolkits & templates'].includes(lower)) {
    return exec('tools', { id, ...child })
  } else if (['event', 'events'].includes(lower)) {
    const ev = { ...child }
    if (ev.eventMode && !ev.mode) ev.mode = ev.eventMode
    if (ev.eventAgenda && !ev.agenda) ev.agenda = ev.eventAgenda
    return exec('events', { id, ...ev })
  }
}

// ---------- action handlers ----------
async function handleCreate(body) {
  const supabase = getSupabase()
  const { base = {}, type = '', child = {} } = body || {}

  if (!base || !base.title) throw new Error('Invalid payload: base.title is required')

  const domainLabel =
    base && typeof base.domain === 'string' && base.domain.trim()
      ? String(base.domain).trim()
      : null
  const tags = Array.isArray(base.tags) ? base.tags.filter(Boolean) : []
  if (domainLabel && !tags.includes(domainLabel)) tags.push(domainLabel)

  const typeLike = String(type || base.type || '').trim()
  const fmt = base?.format?.trim?.() ? String(base.format).trim() : null
  const pop = base?.popularity?.trim?.() ? String(base.popularity).trim() : null
  const canonType = canonTypeStr(typeLike)

  await validateFormatAndPopularity(supabase, fmt, pop, canonType)

  const insertPayload = {
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    status: base.status || 'Draft',
    visibility: base.visibility || 'Public',
    language: base.language || 'en',
    published_at: base.published_at || null,
    seo_title: base.seo_title || null,
    seo_description: base.seo_description || null,
    canonical_url: base.canonical_url || null,
    thumbnail_url: base.thumbnail_url || null,
    tags,
    domain: domainLabel || null,
    format: fmt || null,
    popularity: pop || null,
    authors: base.authors || null,
    author_slugs: base.author_slugs || null
  }

  // insert base with fallback if some columns don't exist
  let inserted = null
  try {
    const r1 = await supabase.from('media_items').insert([insertPayload]).select('id').single()
    inserted = r1.data
    if (r1.error) throw r1.error
  } catch (e) {
    if (/schema cache|PGRST204/i.test(String(e?.message || e))) {
      const { domain, format, popularity, ...fallbackPayload } = insertPayload
      const r2 = await supabase.from('media_items').insert([fallbackPayload]).select('id').single()
      inserted = r2.data
      if (r2.error) throw r2.error
    } else {
      throw e
    }
  }

  const id = inserted?.id
  if (!id) throw new Error('Failed to obtain new id')

  try {
    await upsertChildTable(supabase, type, id, child, 'insert')
  } catch (childErr) {
    await supabase.from('media_items').delete().eq('id', id) // rollback
    throw childErr
  }

  await assignDomainMapping(supabase, id, domainLabel)
  return { ok: true, id }
}

async function handleUpdate(body) {
  const supabase = getSupabase()
  const { id, base, type, child } = body || {}
  if (!id || !base) throw new Error('id and base are required')

  const domainLabel =
    base && typeof base.domain === 'string' && base.domain.trim()
      ? String(base.domain).trim()
      : null
  const tags = Array.isArray(base.tags) ? base.tags.filter(Boolean) : []
  if (domainLabel && !tags.includes(domainLabel)) tags.push(domainLabel)

  const typeLike = String(type || base.type || '').trim()
  const fmt = base?.format === null ? null : (base?.format?.trim?.() ? String(base.format).trim() : undefined)
  const pop = base?.popularity === null ? null : (base?.popularity?.trim?.() ? String(base.popularity).trim() : undefined)
  const canonType = canonTypeStr(typeLike)

  // soft validate: only set when valid; undefined = leave unchanged
  let fmtForUpdate = undefined
  if (typeof fmt !== 'undefined') {
    if (fmt === null || fmt === '') fmtForUpdate = null
    else {
      const { data: fmtRow } = await supabase
        .from('taxonomies')
        .select('id, allowed_media_types, archived')
        .eq('kind', 'Format')
        .eq('label', fmt)
        .limit(1)
        .maybeSingle()
      if (fmtRow && !fmtRow.archived) {
        const allowed = Array.isArray(fmtRow.allowed_media_types) ? fmtRow.allowed_media_types : []
        if (!canonType || allowed.length === 0 || allowed.includes(canonType)) fmtForUpdate = fmt
      }
    }
  }

  let popForUpdate = undefined
  if (typeof pop !== 'undefined') {
    if (pop === null || pop === '') popForUpdate = null
    else {
      const { data: popRow } = await supabase
        .from('taxonomies')
        .select('id, archived')
        .eq('kind', 'Popularity')
        .eq('label', pop)
        .limit(1)
        .maybeSingle()
      if (popRow && !popRow.archived) popForUpdate = pop
    }
  }

  // update base
  const baseCols = {
    slug: base.slug,
    title: base.title,
    summary: base.summary,
    status: base.status,
    visibility: base.visibility,
    language: base.language,
    published_at: base.published_at,
    seo_title: base.seo_title,
    seo_description: base.seo_description,
    canonical_url: base.canonical_url,
    thumbnail_url: base.thumbnail_url,
    tags,
    domain: domainLabel || null,
    authors: base.authors || null,
    author_slugs: base.author_slugs || null
  }
  if (typeof fmtForUpdate !== 'undefined') baseCols.format = fmtForUpdate
  if (typeof popForUpdate !== 'undefined') baseCols.popularity = popForUpdate

  try {
    const r1 = await supabase.from('media_items').update(baseCols).eq('id', id)
    if (r1.error) throw r1.error
  } catch (e) {
    if (/schema cache|PGRST204|domain|format|popularity|authors|author_slugs/i.test(String(e?.message || e))) {
      const { domain, format, popularity, authors, author_slugs, ...fallback } = baseCols
      const r2 = await supabase.from('media_items').update(fallback).eq('id', id)
      if (r2.error) throw r2.error
    } else {
      throw e
    }
  }

  // upsert child
  if (type) {
    try {
      await upsertChildTable(supabase, type, id, child, 'upsert')
    } catch {
      // keep base even if child fails
    }
  }

  await assignDomainMapping(supabase, id, domainLabel)
  return { ok: true, id }
}

async function handleDelete(body) {
  const supabase = getSupabase()
  const ids = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : body?.id ? [body.id] : []
  if (ids.length === 0) throw new Error('id or ids required')
  const { error } = await supabase.from('media_items').delete().in('id', ids)
  if (error) throw error
  return { ok: true, count: ids.length }
}

// ---------- main handler ----------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  try {
    const body = await parseBody(req)
    const action = (req.query?.action || body?.action || '').toString().toLowerCase()

    let result
    if (action === 'create') result = await handleCreate(body)
    else if (action === 'update') result = await handleUpdate(body)
    else if (action === 'delete') result = await handleDelete(body)
    else throw new Error('Unsupported action. Use one of: create, update, delete')

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(result))
  } catch (e) {
    console.error('Admin media action failed', e)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: e?.message || 'Request failed' }))
  }
}
