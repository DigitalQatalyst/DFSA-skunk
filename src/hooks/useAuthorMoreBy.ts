import { useEffect, useState } from 'react'
import { getSupabase } from '../services/supabaseClientKH'
import { mapGridToCard } from '../services/knowledgeHubGrid'

export function useAuthorMoreBy(item?: any) {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    if (!item?.id) return
    const run = async () => {
      try {
        const supabase = getSupabase()
        const authorSlug = Array.isArray(item?.authorSlugs) ? item.authorSlugs[0] : null
        if (!authorSlug) { setItems([]); return }
        const { data: rel, error } = await supabase
          .from('v_media_public_grid')
          .select('id,title,summary,thumbnail_url,type,tags,published_at,start_at,registration_url,document_url,primary_author_name,primary_author_slug,primary_author_photo_url,authors,authors_count,author_slugs')
          .neq('id', item.id)
          .contains('author_slugs', [authorSlug])
          .order('published_at', { ascending: false })
          .limit(6)
        if (error) throw error
        const posts = (rel ?? []).map((r: any) => mapGridToCard(r))
        setItems(posts)
      } catch {
        setItems([])
      }
    }
    run()
  }, [item?.id])

  return items
}
