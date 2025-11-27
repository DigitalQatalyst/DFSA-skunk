// Shared constants for media formats and popularity across Admin, API, and Grid

export const MEDIA_TYPE_FORMAT_MAPPING = {
  'News': ['Quick Reads'],
  'Article': ['Quick Reads', 'In-Depth Reports'],
  'Reports': ['In-Depth Reports', 'Downloadable Templates'],
  'Toolkits & Templates': ['Interactive Tools', 'Downloadable Templates'],
  'Guides': ['Quick Reads', 'In-Depth Reports'],
  'Events': ['Live Events'],
  'Videos': ['Recorded Media'],
  'Podcasts': ['Recorded Media'],
}

export const POPULARITY_OPTIONS = ['Latest', 'Trending', 'Most Downloaded', "Editor's Pick"]

// Resolve a UI mapping key from a variety of type inputs (UI or canonical DB)
export function resolveUiTypeKey(input) {
  const t = String(input || '').toLowerCase()
  if (!t) return null
  if (t === 'news') return 'News'
  if (t === 'report' || t === 'reports') return 'Reports'
  if (t === 'tool' || t === 'toolkit' || t === 'toolkits & templates' || t === 'tools') return 'Toolkits & Templates'
  if (t === 'guide' || t === 'guides') return 'Guides'
  if (t === 'event' || t === 'events') return 'Events'
  if (t === 'video' || t === 'videos') return 'Videos'
  if (t === 'podcast' || t === 'podcasts') return 'Podcasts'
  if (t === 'article' || t === 'articles') return 'Article'
  return null
}

export function resolveAllowedFormats(typeLike) {
  const key = resolveUiTypeKey(typeLike)
  if (!key) return []
  return MEDIA_TYPE_FORMAT_MAPPING[key] || []
}
