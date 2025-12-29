import { randomUUID } from 'crypto';
import {
  HELP_CENTER_SUBTYPES,
  HELP_CENTER_TYPES,
  type HelpCenterType,
  type HelpCenterDifficulty,
  type HelpCenterStatus,
} from './types.js';

export type HelpCenterStep = { title: string; content: string };
export type HelpCenterResource = { title: string; url: string };

export type NormalizedHelpCenterPayload = {
  id?: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string | null;
  tags: string[];
  readTime: string | null;
  type: HelpCenterType;
  difficulty: HelpCenterDifficulty;
  steps: HelpCenterStep[];
  resources: HelpCenterResource[];
  videoUrl: string | null;
  status: HelpCenterStatus;
  publishedAt: Date | null;
};

const DEFAULT_DIFFICULTY: HelpCenterDifficulty = 'Beginner';
const STATUS_VALUES: HelpCenterStatus[] = ['Draft', 'Published'];

function cleanHtml(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  let sanitized = value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
  sanitized = sanitized.trim();
  return sanitized.length ? sanitized : null;
}

function cleanText(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null;
  const sanitized = value.replace(/<[^>]+>/g, '').trim();
  return sanitized.length ? sanitized : null;
}

function normalizeString(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeSteps(value: unknown): HelpCenterStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((step) => ({
      title: cleanText(step?.title)?.substring(0, 200) || '',
      content: cleanHtml(step?.content)?.substring(0, 5000) || '',
    }))
    .filter((step) => step.title && step.content);
}

function normalizeResources(value: unknown): HelpCenterResource[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((resource) => ({
      title: cleanText(resource?.title)?.substring(0, 200) || '',
      url: normalizeString(resource?.url) || '',
    }))
    .filter((resource) => resource.title && resource.url);
}

function normalizeType(value: unknown, fallback: HelpCenterType = 'Guide'): HelpCenterType {
  if (typeof value === 'string') {
    const match = HELP_CENTER_TYPES.find((t) => t.toLowerCase() === value.toLowerCase());
    if (match) return match;
  }
  return fallback;
}

function normalizeDifficulty(
  value: unknown,
  fallback: HelpCenterDifficulty = DEFAULT_DIFFICULTY,
): HelpCenterDifficulty {
  if (typeof value === 'string') {
    const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (['Beginner', 'Intermediate', 'Advanced'].includes(normalized)) {
      return normalized as HelpCenterDifficulty;
    }
  }
  return fallback;
}

function normalizeStatus(value: unknown, fallback: HelpCenterStatus = 'Draft'): HelpCenterStatus {
  if (typeof value === 'string') {
    const match = STATUS_VALUES.find((status) => status.toLowerCase() === value.toLowerCase());
    if (match) return match;
  }
  return fallback;
}

function normalizeDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function mapTypeToContent(type: HelpCenterType) {
  if (type === 'Video') {
    return { content_type: 'Video', content_subtype: 'walkthrough' as (typeof HELP_CENTER_SUBTYPES)[number] };
  }
  if (type === 'FAQ') {
    return { content_type: 'Article', content_subtype: 'faq' };
  }
  if (type === 'Walkthrough') {
    return { content_type: 'Article', content_subtype: 'walkthrough' };
  }
  return { content_type: 'Article', content_subtype: 'guide' };
}

export function normalizeHelpCenterPayload(
  input: any,
  defaults?: Partial<NormalizedHelpCenterPayload>,
): NormalizedHelpCenterPayload {
  const title = cleanText(input?.title) || cleanText(defaults?.title) || '';
  if (!title) {
    throw new Error('Title is required');
  }

  const description = cleanText(input?.description) ?? defaults?.description ?? null;
  const content = cleanHtml(input?.content) ?? defaults?.content ?? null;
  const category = normalizeString(input?.category) ?? defaults?.category ?? null;
  const tags = normalizeArray(input?.tags?.length ? input.tags : defaults?.tags);
  const readTime = normalizeString(input?.readTime) ?? defaults?.readTime ?? null;
  const type = normalizeType(input?.type, defaults?.type ?? 'Guide');
  const difficulty = normalizeDifficulty(input?.difficulty, defaults?.difficulty ?? DEFAULT_DIFFICULTY);
  const steps = normalizeSteps(input?.steps?.length ? input.steps : defaults?.steps);
  const resources = normalizeResources(input?.resources?.length ? input.resources : defaults?.resources);
  const videoUrl = normalizeString(input?.videoUrl ?? defaults?.videoUrl) ?? null;
  const status = normalizeStatus(input?.status, defaults?.status ?? 'Draft');
  const publishedAt =
    normalizeDate(input?.publishedAt ?? defaults?.publishedAt) ??
    (status === 'Published' ? new Date() : null);

  return {
    id: input?.id ?? defaults?.id ?? randomUUID(),
    title,
    description,
    content,
    category,
    tags,
    readTime,
    type,
    difficulty,
    steps,
    resources,
    videoUrl,
    status,
    publishedAt,
  };
}

export function buildSupabaseRow(
  payload: NormalizedHelpCenterPayload,
  existingMetadata?: Record<string, any> | null,
) {
  const metadata = { ...(existingMetadata || {}) };
  metadata.hc_type = payload.type;
  metadata.hc_difficulty = payload.difficulty;
  metadata.hc_steps = payload.steps;
  metadata.hc_resources = payload.resources;
  metadata.hc_helpful =
    typeof metadata.hc_helpful === 'number' && Number.isFinite(metadata.hc_helpful)
      ? metadata.hc_helpful
      : 0;

  if (payload.type === 'Video') {
    delete metadata.hc_video_url;
  } else if (payload.videoUrl) {
    metadata.hc_video_url = payload.videoUrl;
  } else {
    delete metadata.hc_video_url;
  }

  const { content_type, content_subtype } = mapTypeToContent(payload.type);

  return {
    title: payload.title,
    summary: payload.description,
    description: payload.description,
    content: payload.content,
    content_type,
    content_subtype,
    category: payload.category,
    tags: payload.tags,
    read_time: payload.readTime,
    metadata,
    status: payload.status,
    published_at: payload.status === 'Published' ? payload.publishedAt?.toISOString() ?? new Date().toISOString() : null,
    content_url: payload.type === 'Video' ? payload.videoUrl : null,
    updated_at: new Date().toISOString(),
  };
}
