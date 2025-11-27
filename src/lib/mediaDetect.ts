/**
 * Media detection utilities: determine whether a URL is audio or video and detect provider platform.
 * Heuristics-first (hostnames, extensions), with optional HEAD MIME check that fails gracefully.
 */

export type MediaKind = 'video' | 'audio' | 'unknown'
export type MediaPlatform =
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'spotify'
  | 'soundcloud'
  | 'podbean'
  | 'anchor'
  | 'file'
  | 'unknown'

const VIDEO_EXT = [/\.mp4$/i, /\.webm$/i, /\.mov$/i, /\.mkv$/i, /\.m3u8$/i]
const AUDIO_EXT = [/\.mp3$/i, /\.m4a$/i, /\.aac$/i, /\.wav$/i, /\.ogg$/i]

export function detectPlatform(url: string): MediaPlatform {
  if (!url) return 'unknown'
  let host = ''
  try { host = new URL(url).hostname.toLowerCase() } catch { return 'unknown' }
  if (/youtu\.be$|youtube\.com$/.test(host)) return 'youtube'
  if (/vimeo\.com$/.test(host)) return 'vimeo'
  if (/dailymotion\.com$/.test(host)) return 'dailymotion'
  if (/open\.spotify\.com$/.test(host)) return 'spotify'
  if (/(^|\.)soundcloud\.com$/.test(host)) return 'soundcloud'
  if (/podbean\.com$/.test(host)) return 'podbean'
  if (/anchor\.fm$/.test(host)) return 'anchor'
  // Fallback to extension-based
  if (VIDEO_EXT.some((rx) => rx.test(url))) return 'file'
  if (AUDIO_EXT.some((rx) => rx.test(url))) return 'file'
  return 'unknown'
}

export async function detectMediaType(url: string): Promise<MediaKind> {
  if (!url) return 'unknown'
  const platform = detectPlatform(url)
  if (platform === 'youtube' || platform === 'vimeo' || platform === 'dailymotion') return 'video'
  if (platform === 'spotify' || platform === 'soundcloud' || platform === 'podbean' || platform === 'anchor') return 'audio'
  if (VIDEO_EXT.some((rx) => rx.test(url))) return 'video'
  if (AUDIO_EXT.some((rx) => rx.test(url))) return 'audio'
  // Optional HEAD check — best effort only
  try {
    const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' as any })
    // With no-cors, we may not be able to read headers; attempt a GET if allowed
    const ct = (res as any)?.headers?.get?.('content-type') || ''
    if (/^video\//i.test(ct)) return 'video'
    if (/^audio\//i.test(ct)) return 'audio'
  } catch {
    // ignore CORS/network failures; fall through to unknown
  }
  return 'unknown'
}

// Provider embed helpers
export function getYouTubeEmbedSrc(url: string): string {
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1)
    else if (u.searchParams.get('v')) id = u.searchParams.get('v') || ''
    else if (u.pathname.includes('/embed/')) id = u.pathname.split('/embed/')[1]
    return id ? `https://www.youtube.com/embed/${id}` : ''
  } catch { return '' }
}
export function getVimeoEmbedSrc(url: string): string {
  const m = (url || '').match(/vimeo\.com\/(\d+)/i)
  return m && m[1] ? `https://player.vimeo.com/video/${m[1]}` : ''
}
export function getDailymotionEmbedSrc(url: string): string {
  const m = (url || '').match(/dailymotion\.com\/video\/([a-z0-9]+)/i)
  return m && m[1] ? `https://www.dailymotion.com/embed/video/${m[1]}` : ''
}
export function getSpotifyEmbedSrc(url: string): string {
  try {
    const u = new URL(url)
    // Pass-through episode/show/track URLs to embed path
    return `https://open.spotify.com/embed${u.pathname}`
  } catch { return '' }
}
export function getSoundCloudEmbedSrc(url: string): string {
  const enc = encodeURIComponent(url)
  return `https://w.soundcloud.com/player/?url=${enc}&color=%230066cc&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`
}

