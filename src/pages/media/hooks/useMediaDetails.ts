/**
 * useMediaDetails
 * Fetches a MediaItem by id from v_media_public and loads 3 related items by type.
 * Also triggers a one-time view tracking POST when an item is loaded.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { getSupabase } from '../../../services/supabaseClientKH'
import { MediaItem } from '../../../types/media'
import { mapRowToItem } from '../../../utils/mediaDetail'

export const useMediaDetails = (id?: string | null) => {
  const [item, setItem] = useState<MediaItem | null>(null)
  const [relatedItems, setRelatedItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const viewLoggedRef = useRef(false)
  
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      if (!id) {
        setError('No media ID provided')
        setLoading(false)
        return
      }
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from('v_media_public')
          .select('*')
          .eq('id', id)
          .single()
        if (error) throw error
        if (!cancelled && data) {
          const mapped = mapRowToItem(data)
          setItem(mapped)
          const { data: rel } = await supabase
            .from('v_media_public')
            .select('*')
            .neq('id', id)
            .eq('type', data.type)
            .order('published_at', { ascending: false })
            .limit(3)
          const related = (rel || []).map(mapRowToItem)
          if (!cancelled) setRelatedItems(related)
        }
        if (!cancelled) setLoading(false)
      } catch (e: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('useMediaDetails failed:', e)
        }
        if (!cancelled) {
          setError('Failed to load media details')
          setLoading(false)
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

  // Track a view (once)
  useEffect(() => {
    if (!item || viewLoggedRef.current) return
    viewLoggedRef.current = true
    try {
      fetch('/api/media/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId: item.id }),
        credentials: 'include',
      }).catch(() => {})
    } catch {}
  }, [item?.id])

  return useMemo(() => ({ item, relatedItems, loading, error }), [item, relatedItems, loading, error])
}
