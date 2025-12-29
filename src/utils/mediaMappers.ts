import {
  getAudioUrl,
  getVideoUrl,
  getPosterUrl,
  getDuration,
} from './mediaSelectors'

/**
 * Maps an API item to the props format expected by the card component
 */
export function mapApiItemToCardProps(item: any) {
  // Get normalized duration info
  const durationInfo = getDuration(item)
  const rawAuthors =
    Array.isArray(item.authors)
      ? item.authors
      : Array.isArray(item.authors_preview)
        ? item.authors_preview
        : []
  const authors = rawAuthors
    .map((author: any) => ({
      name: author?.name || null,
      slug: author?.slug || null,
      photoUrl: author?.photoUrl || author?.photo_url || null,
      title: author?.title || null,
      organization: author?.organization || null,
    }))
    .filter((a) => a.name)

  const authorsCount =
    typeof item.authorsCount === 'number'
      ? item.authorsCount
      : typeof item.authors_count === 'number'
        ? item.authors_count
        : authors.length

  const authorSlugs = Array.isArray(item.authorSlugs)
    ? item.authorSlugs
    : Array.isArray(item.author_slugs)
      ? item.author_slugs
      : undefined

  const primaryAuthorSource =
    item.primaryAuthor ||
    item.primary_author ||
    (item.primary_author_name
      ? {
          name: item.primary_author_name,
          slug: item.primary_author_slug || null,
          photoUrl: item.primary_author_photo_url || null,
          title: item.primary_author_title || null,
          organization: item.primary_author_organization || null,
        }
      : null) ||
    (authors.length > 0 ? authors[0] : null)

  const primaryAuthor = primaryAuthorSource && primaryAuthorSource.name
    ? {
        name: primaryAuthorSource.name,
        slug: primaryAuthorSource.slug || null,
        photoUrl: primaryAuthorSource.photoUrl || null,
        title: primaryAuthorSource.title || null,
        organization: primaryAuthorSource.organization || null,
      }
    : undefined
  // Extract and normalize data from the API item
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    mediaType: item.mediaType || 'resource',
    isVideoEpisode: !!(item.isVideoEpisode ?? item.is_video_episode ?? false),
    provider: {
      name: item.provider?.name || item.source || 'Unknown Provider',
      logoUrl: item.provider?.logoUrl || null,
    },
    imageUrl: getPosterUrl(item),
    videoUrl: getVideoUrl(item),
    audioUrl: getAudioUrl(item),
    processedAudioUrl: item.processedAudioUrl,
    tags: item.tags || [],
    date: item.date || item.lastUpdated,
    downloadCount: item.downloadCount,
    fileSize: item.fileSize,
    duration: durationInfo.available ? durationInfo.formatted : item.duration,
    durationSeconds: durationInfo.available ? durationInfo.seconds : 0,
    location: item.location,
    category: item.category,
    format: item.format,
    popularity: item.popularity,
    episodes: item.episodes,
    lastUpdated: item.lastUpdated,
    domain: item.domain,
    businessStage: item.businessStage,
    primaryAuthor,
    authors,
    authorsCount,
    authorSlugs,
    // Generate a details URL path
    detailsHref: `/media/${(item.mediaType || 'resource').toLowerCase().replace(/\s+/g, '-')}/${item.id}`,
  }
}

/**
 * Maps an API item to the detailed props format expected by the detail page
 */
export function mapApiItemToDetailProps(item: any) {
  // Start with the card props as a base
  const baseProps = mapApiItemToCardProps(item)
  // Add additional detail-specific properties
  return {
    ...baseProps,
    // Additional fields that might be needed for the detail view
    content: item.content,
    relatedItems: (item.relatedItems || []).map(mapApiItemToCardProps),
    metadata: {
      author: item.author,
      publishDate: item.date,
      lastUpdated: item.lastUpdated,
      readTime: item.readTime,
      views: item.views,
      downloads: item.downloadCount,
      fileSize: item.fileSize,
      format: item.format,
      language: item.language || 'English',
      license: item.license,
    },
    // Format resources for rendering
    resources: item.resources
      ? item.resources.map((resource: any) => ({
          id: resource.id,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          fileSize: resource.fileSize,
        }))
      : [],
    // Format actions for rendering
    actions: [
      getVideoUrl(item)
        ? { label: 'Watch Video', url: getVideoUrl(item), icon: 'play' }
        : null,
      getAudioUrl(item)
        ? { label: 'Listen', url: getAudioUrl(item), icon: 'volume-2' }
        : null,
      item.downloadUrl
        ? { label: 'Download', url: item.downloadUrl, icon: 'download' }
        : null,
      item.externalUrl
        ? {
            label: 'Visit Website',
            url: item.externalUrl,
            icon: 'external-link',
          }
        : null,
    ].filter(Boolean),
  }
}
