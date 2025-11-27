import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSupabase } from '../services/supabaseClientKH'
import { mapGridToCard } from '../services/knowledgeHubGrid'
import { formatFileSize } from '../utils/documentMetadata'
import { plainText } from '../utils/sanitize'

export interface MediaItemVM {
  id: string
  type?: string
  title: string
  description?: string
  content?: string
  provider?: { name?: string | null; logoUrl?: string | null }
  authors?: any[]
  authorSlugs?: string[]
  authorsCount?: number
  author?: any
  primaryAuthor?: any
  imageUrl?: string | null
  tags?: string[]
  date?: string | null
  lastUpdated?: string | null
  // video
  videoUrl?: string | null
  posterUrl?: string | null
  platform?: string | null
  duration?: number | string | null
  transcriptUrl?: string | null
  captions?: any[] | null
  chapters?: any[] | null
  speakers?: any[] | null
  relatedLinks?: any[] | null
  videoResolution?: string | null
  descriptionHtml?: string | null
  descriptionJson?: any | null
  // podcast
  audioUrl?: string | null
  isVideoEpisode?: boolean | null
  // toolkit/doc
  downloadUrl?: string | null
  fileSizeBytes?: number | null
  fileSize?: string | null
  toolRequirements?: any
  toolFileSizeMb?: number | null
  reportHighlights?: any
  reportToc?: any
  // events
  eventDate?: string | null
  eventTime?: string | null
  eventLocation?: string | null
  eventLocationDetails?: string | null
  eventRegistrationInfo?: string | null
  registrationUrl?: string | null
  eventMode?: string | null
  startAt?: string | null
  endAt?: string | null
  eventAgenda?: any
  downloadCount?: number | null
  language?: string | null
  domain?: string | null
  businessStage?: string | null
  episodeNumber?: number | null
}

function mapRowToItem(row: any): MediaItemVM {
  const rawAuthors = Array.isArray((row as any).authors) ? (row as any).authors : []
  const authors = rawAuthors
    .map((author: any) => ({
      name: author?.name || null,
      slug: author?.slug || null,
      photoUrl: author?.photoUrl || author?.photo_url || null,
      title: author?.title || null,
      organization: author?.organization || null,
      bio: author?.bio || null,
    }))
    .filter((a) => a.name)
  const authorSlugs = Array.isArray((row as any).author_slugs)
    ? (row as any).author_slugs.filter(Boolean)
    : []
  const authorsCount =
    typeof (row as any).authors_count === 'number'
      ? (row as any).authors_count
      : authors.length
  const primaryAuthor = (row as any).primary_author_name
    ? {
        name: (row as any).primary_author_name,
        slug: (row as any).primary_author_slug || null,
        photoUrl: (row as any).primary_author_photo_url || null,
        title: (row as any).primary_author_title || null,
        organization: (row as any).primary_author_organization || null,
        bio: null,
      }
    : authors.length > 0
      ? authors[0]
      : null
  return {
    id: row.id,
    type: row.type || 'Resource',
    title: row.title,
    description: plainText((row as any).summary || (row as any).body_html || (row as any).article_body_html || (row as any).body || ''),
    content: row.body_html || row.body,
    provider: { name: row.provider_name || 'Knowledge Hub', logoUrl: row.provider_logo_url || null },
    authors,
    authorsCount,
    authorSlugs,
    primaryAuthor,
    author: primaryAuthor,
    imageUrl: row.thumbnail_url || row.image_url || null,
    videoUrl: row.video_url || null,
    posterUrl: (row as any).poster_url || (row as any).video_poster_url || null,
    platform: (row as any).platform || null,
    duration: (row as any).video_duration_sec || null,
    audioUrl: (row as any).podcast_url || (row as any).audio_url || null,
    transcriptUrl: (row as any).video_transcript_url || (row as any).audio_transcript_url || null,
    captions: (row as any).captions || (row as any).video_captions || null,
    chapters: (row as any).chapters || (row as any).video_chapters || null,
    speakers: (row as any).speakers || (row as any).video_speakers || null,
    relatedLinks: (row as any).related_links || null,
    videoResolution: (row as any).video_resolution || null,
    descriptionHtml: (row as any).description_html || (row as any).body_html || null,
    descriptionJson: (row as any).description_json || (row as any).body_json || null,
    language: row.language || null,
    domain: (row as any).domain || null,
    businessStage: (row as any).business_stage || null,
    episodeNumber: (row as any).episode_no || null,
    isVideoEpisode: (row as any).is_video_episode ?? null,
    downloadUrl: (row as any).report_document_url || (row as any).tool_document_url || (row as any).document_url || null,
    tags: row.tags || [],
    date: row.published_at,
    lastUpdated: row.updated_at,
    reportHighlights: (row as any).report_highlights || null,
    reportToc: (row as any).report_toc || null,
    eventDate: (row as any).event_date || (row as any).start_at || null,
    eventTime: (row as any).event_time || null,
    eventLocation: (row as any).event_location || (row as any).venue || null,
    eventLocationDetails: row.event_location_details || null,
    eventRegistrationInfo: (row as any).event_registration_info || null,
    registrationUrl: (row as any).registration_url || null,
    eventMode: (row as any).event_mode || null,
    startAt: (row as any).start_at || null,
    endAt: (row as any).end_at || null,
    eventAgenda: row.event_agenda || null,
    fileSizeBytes: (row as any).file_size_bytes || null,
    fileSize: formatFileSize((row as any).file_size_bytes) || null,
    downloadCount: (row as any).download_count || null,
    toolRequirements: (row as any).tool_requirements || null,
    toolFileSizeMb: (row as any).tool_file_size_mb != null ? Number((row as any).tool_file_size_mb) : null,
  }
}

export function useMediaDetails(id?: string) {
  const [item, setItem] = useState<MediaItemVM | null>(null)
  const [relatedItems, setRelatedItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      if (!id) throw new Error('No media ID provided')
      const supabase = getSupabase()
      const { data: contentData, error: contentError } = await supabase
        .from('v_media_public')
        .select('*')
        .eq('id', id)
        .single()
      if (contentError) throw contentError
      if (!contentData) throw new Error('Not found')
      const mapped = mapRowToItem(contentData)
      setItem(mapped)

      const { data: rel } = await supabase
        .from('v_media_public')
        .select('*')
        .neq('id', id)
        .eq('type', contentData.type)
        .order('published_at', { ascending: false })
        .limit(3)
      const related = (rel || []).map((r: any) => mapRowToItem(r))
      setRelatedItems(related)
    } catch (e: any) {
      setError(e?.message || 'Failed to load media details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { if (id) reload() }, [id, reload])

  return { item, relatedItems, loading, error, reload }
}
