import { getSupabaseKnowledgeHub } from '../lib/supabase'

export type GridCursor = {
  p: string // published_at ISO
  id: string | number
}

export function encodeCursor(cur: GridCursor | null): string | null {
  if (!cur) return null
  try {
    // Use browser-safe base64
    return btoa(unescape(encodeURIComponent(JSON.stringify(cur))))
  } catch {
    return null
  }
}

export function decodeCursor(s: string | null | undefined): GridCursor | null {
  if (!s) return null
  try {
    const json = decodeURIComponent(escape(atob(String(s))))
    const obj = JSON.parse(json)
    if (obj && obj.p && obj.id !== undefined) return obj as GridCursor
  } catch {}
  return null
}

export interface ListPublicMediaParams {
  limit?: number
  after?: string | null // base64 cursor from encodeCursor
  tag?: string | null
  q?: string | null
  type?: string | null
}

export interface PublicMediaItem {
  id: string
  title: string
  summary: string | null
  thumbnail_url: string | null
  type: string | null
  tags: string[] | null
  published_at: string | null
  start_at?: string | null
  registration_url?: string | null
  document_url?: string | null
  primary_author_name?: string | null
  primary_author_slug?: string | null
  primary_author_photo_url?: string | null
  authors?: Array<Record<string, any>> | null
  authors_count?: number | null
  author_slugs?: string[] | null
}

export interface ListPublicMediaResult {
  items: PublicMediaItem[]
  nextCursor: string | null
}

// Fetch lean grid items using keyset pagination against v_media_public_grid
export async function listPublicMedia({ limit = 12, after, tag, q, type }: ListPublicMediaParams = {}): Promise<ListPublicMediaResult> {
  const supabase = getSupabaseKnowledgeHub()
  let query = supabase
    // .schema('admin')
    .from('v_media_public_grid')
    .select('id,title,summary,thumbnail_url,type,tags,published_at,start_at,registration_url,document_url,primary_author_name,primary_author_slug,primary_author_photo_url,authors,authors_count,author_slugs')
    .order('published_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit)

  // Keyset cursor
  const cur = decodeCursor(after)
  if (cur && cur.p && cur.id !== undefined && cur.id !== null) {
    // (published_at, id) < (cur.p, cur.id) using OR grouping
    // Do not URL-encode values; Supabase/PostgREST handles encoding
    const p = String(cur.p)
    const id = String(cur.id)
    query = query.or(`published_at.lt.${p},and(published_at.eq.${p},id.lt.${id})`)
  }

  // Tag filter against tags JSON/array
  if (tag) {
    try {
      query = query.contains('tags', [tag])
    } catch {
      // Ignore if data type is not jsonb/array
    }
  }

  // Type filter
  if (type && type.trim()) {
    query = query.eq('type', type)
  }

  // Basic title search (trigram/ilike accelerated by index when available)
  if (q && q.trim()) {
    const safe = q.replace(/%/g, '')
    query = query.ilike('title', `%${safe}%`)
  }

  const { data, error } = await query
  if (error) throw error
  const items = (data || []) as PublicMediaItem[]
  const last = items[items.length - 1]
  const nextCursor = last && last.published_at
    ? encodeCursor({ p: last.published_at, id: last.id })
    : null
  return { items, nextCursor }
}

// Map grid item to KnowledgeHubCard shape (minimal fields only)
export function mapGridToCard(item: PublicMediaItem) {
  const authorList = Array.isArray(item.authors)
    ? item.authors
        .map((author: any) => ({
          name: author?.name || null,
          slug: author?.slug || null,
          photoUrl: author?.photoUrl || null,
          title: author?.title || null,
          organization: author?.organization || null,
        }))
        .filter((a) => a.name)
    : []

  const primaryAuthor =
    authorList[0] ||
    (item.primary_author_name
      ? {
          name: item.primary_author_name,
          slug: item.primary_author_slug || null,
          photoUrl: item.primary_author_photo_url || null,
        }
      : null)

  return {
    id: String(item.id),
    title: item.title,
    description: item.summary || '',
    mediaType: item.type || undefined,
    provider: { name: 'Knowledge Hub', logoUrl: '/mzn_logo.png' },
    imageUrl: item.thumbnail_url || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
    // Use event start date for Events; fallback to published_at for others
    date: (item.type && item.type.toLowerCase() === 'event')
      ? (item.start_at || item.published_at || undefined)
      : (item.published_at || undefined),
    // Provide registration and download URLs when available
    registrationUrl: item.registration_url || undefined,
    downloadUrl: item.document_url || undefined,
    primaryAuthor: primaryAuthor,
    authors: authorList,
    authorsCount:
      typeof item.authors_count === 'number'
        ? item.authors_count
        : authorList.length,
    authorSlugs: Array.isArray(item.author_slugs)
      ? item.author_slugs.filter(Boolean)
      : undefined,
  }
}
