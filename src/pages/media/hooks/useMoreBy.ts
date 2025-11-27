/**
 * useMoreBy
 * Fetches up to 6 additional posts by the same author (slug/name) or provider.
 */
import { useEffect, useMemo, useState } from 'react'
import { getSupabase } from '../../../services/supabaseClientKH'
import { MediaItem } from '../../../types/media'
import { stripHtml, buildPgArrayContainsValue } from '../../../utils/mediaDetail'

export type MoreByItem = {
  id: string
  title: string
  description: string
  mediaType: string
  provider: { name: string; logoUrl?: string | null }
  imageUrl?: string | null
  tags: string[]
  date?: string | null
}

export const useMoreBy = (item: MediaItem | null) => {
  const [providerPosts, setProviderPosts] = useState<MoreByItem[]>([])

  useEffect(() => {
    let cancelled = false
    if (!item?.id) return
    const fetchMore = async () => {
      try {
        const supabase = getSupabase()
        let q = supabase
          .from('v_media_public')
          .select('id, title, summary, body_html, article_body_html, body, type, tags, published_at, thumbnail_url, image_url, provider_name, provider_logo_url, authors, author_slugs')
          .neq('id', item.id)
          .not('published_at', 'is', null)

        const authorSlug = (item as any)?.author?.slug as string | undefined
        const authorName = (item as any)?.author?.name as string | undefined

        if (authorSlug) {
          const containsValue = buildPgArrayContainsValue(authorSlug)
          if (containsValue) {
            q = q.filter('author_slugs', 'cs', containsValue)
          }
        } else if (authorName) {
          q = q.contains('authors', [{ name: authorName }])
        } else if (item?.provider?.name) {
          q = q.eq('provider_name', item.provider.name)
        } else {
          setProviderPosts([])
          return
        }

        const { data: rel, error } = await q.order('published_at', { ascending: false }).limit(6)
        if (error) throw error
        const posts: MoreByItem[] = (rel ?? []).map((r: any) => ({
          id: String(r.id),
          title: r.title,
          description: stripHtml(r.summary || r.body_html || r.article_body_html || r.body || ''),
          mediaType: r.type || 'Resource',
          provider: { name: r.provider_name || 'Knowledge Hub', logoUrl: r.provider_logo_url || null },
          imageUrl: r.thumbnail_url || r.image_url || null,
          tags: r.tags || [],
          date: r.published_at,
        }))
        if (!cancelled) setProviderPosts(posts)
      } catch (e) {
        if (!cancelled) setProviderPosts([])
      }
    }
    fetchMore()
    return () => {
      cancelled = true
    }
  }, [item?.id, (item as any)?.author?.slug, (item as any)?.author?.name, item?.provider?.name])

  return useMemo(() => ({ providerPosts }), [providerPosts])
}
