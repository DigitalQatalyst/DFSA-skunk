import { createClient } from '@supabase/supabase-js';
import {
  HELP_CENTER_SUBTYPES,
  HELP_CENTER_TYPES,
  type HelpCenterType,
  type HelpCenterSubtype,
} from './types.js';
import {
  buildSupabaseRow,
  normalizeHelpCenterPayload,
  type NormalizedHelpCenterPayload,
} from './validation.js';
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

export type HelpCenterArticle = {
  id: string;
  title: string;
  type: HelpCenterType;
  category: string | null;
  description: string | null;
  content: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: Array<{ title: string; content: string }>;
  resources: Array<{ title: string; url: string }>;
  tags: string[];
  readTime: string | null;
  lastUpdated: string | null;
  views: number;
  helpful: number;
  videoUrl: string | null;
};

export type HelpCenterListFilters = {
  search?: string;
  category?: string;
  type?: HelpCenterType;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  sort?: 'recent' | 'popular';
  page?: number;
  pageSize?: number;
  tag?: string;
};

export type HelpCenterListResult = {
  items: HelpCenterArticle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

type CntContentRow = {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  content: string | null;
  content_type: string | null;
  content_subtype: string | null;
  category: string | null;
  tags: string[] | null;
  read_time: string | null;
  view_count: number | null;
  metadata: Record<string, any> | null;
  updated_at: string | null;
  published_at: string | null;
  status: string | null;
  content_url: string | null;
};

function getSupabaseAdmin() {
  const url =
    process.env.VITE_SUPABASE_URL_KH ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase service key not configured');
  }
  return createClient(url, serviceKey);
}

function normalizePage(raw?: number | string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_PAGE;
  return Math.floor(parsed);
}

function normalizePageSize(raw?: number | string): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_PAGE_SIZE;
  return Math.min(Math.floor(parsed), MAX_PAGE_SIZE);
}

function determineType(row: CntContentRow, metadata: Record<string, any>): HelpCenterType {
  const explicit = metadata?.hc_type;
  if (HELP_CENTER_TYPES.includes(explicit)) return explicit as HelpCenterType;

  const subtype = (row.content_subtype || '').toLowerCase() as HelpCenterSubtype;
  if (subtype === 'faq') return 'FAQ';
  if (subtype === 'walkthrough') return 'Walkthrough';

  if (row.content_type === 'Video') return 'Video';
  return 'Guide';
}

function sanitizeArray(value: any, schema: 'steps' | 'resources'): any[] {
  if (!Array.isArray(value)) return [];
  if (schema === 'steps') {
    return value
      .map((item) => ({
        title: String(item?.title || '').trim(),
        content: String(item?.content || '').trim(),
      }))
      .filter((item) => item.title && item.content);
  }

  return value
    .map((item) => ({
      title: String(item?.title || '').trim(),
      url: String(item?.url || '').trim(),
    }))
    .filter((item) => item.title && item.url);
}

function mapRowToArticle(row: CntContentRow): HelpCenterArticle {
  const metadata = (row.metadata ?? {}) as Record<string, any>;
  const difficulty =
    metadata?.hc_difficulty && ['Beginner', 'Intermediate', 'Advanced'].includes(metadata.hc_difficulty)
      ? metadata.hc_difficulty
      : 'Beginner';
  const steps = sanitizeArray(metadata?.hc_steps, 'steps');
  const resources = sanitizeArray(metadata?.hc_resources, 'resources');
  const helpful = Number.parseInt(metadata?.hc_helpful, 10);
  const type = determineType(row, metadata);
  const tags = Array.isArray(row.tags) ? row.tags.filter(Boolean) : [];
  const lastUpdated = row.updated_at || row.published_at;
  const videoUrl =
    row.content_type === 'Video'
      ? row.content_url
      : typeof metadata?.hc_video_url === 'string'
        ? metadata.hc_video_url
        : null;

  return {
    id: row.id,
    title: row.title,
    type,
    category: row.category,
    description: row.summary || row.description || null,
    content: row.content,
    difficulty,
    steps,
    resources,
    tags,
    readTime: row.read_time,
    lastUpdated,
    views: row.view_count || 0,
    helpful: Number.isFinite(helpful) ? helpful : 0,
    videoUrl,
  };
}

function applyFilters(query: any, filters: HelpCenterListFilters) {
  let working = query
    .eq('status', 'Published')
    .in('content_subtype', HELP_CENTER_SUBTYPES);

  if (filters.category) {
    working = working.eq('category', filters.category);
  }

  if (filters.type) {
    const targetType = filters.type.toLowerCase();
    if (targetType === 'video') {
      working = working.eq('content_type', 'Video');
    } else if (targetType === 'faq') {
      working = working.eq('content_subtype', 'faq');
    } else if (targetType === 'walkthrough') {
      working = working.eq('content_subtype', 'walkthrough');
    } else {
      working = working.eq('content_subtype', 'guide');
    }
  } else {
    working = working.order('published_at', { ascending: false });
  }

  if (filters.difficulty) {
    working = working.eq('metadata->>hc_difficulty', filters.difficulty);
  }

  if (filters.tag) {
    working = working.contains('tags', [filters.tag]);
  }

  if (filters.search) {
    const sanitized = filters.search.trim().replace(/,/g, '');
    if (sanitized) {
      const pattern = `%${sanitized}%`;
      working = working.or(
        `title.ilike.${pattern},summary.ilike.${pattern},content.ilike.${pattern}`,
      );
    }
  }

  if (filters.sort === 'popular') {
    working = working.order('view_count', { ascending: false }).order('metadata->>hc_helpful', {
      ascending: false,
      nullsLast: true,
    });
  } else if (filters.sort === 'recent') {
    working = working.order('published_at', { ascending: false }).order('updated_at', {
      ascending: false,
    });
  }

  return working;
}

export async function listHelpCenterArticles(
  filters: HelpCenterListFilters,
): Promise<HelpCenterListResult> {
  const page = normalizePage(filters.page);
  const pageSize = normalizePageSize(filters.pageSize);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('cnt_contents')
    .select(
      `
        id,
        title,
        summary,
        description,
        content,
        content_type,
        content_subtype,
        category,
        tags,
        read_time,
        view_count,
        metadata,
        updated_at,
        published_at,
        status,
        content_url
      `,
      { count: 'exact' },
    );

  query = applyFilters(query, filters);

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  const items = (data || []).map((row: any) => mapRowToArticle(row as CntContentRow));
  const total = count ?? items.length;
  const hasMore = to + 1 < (count ?? 0);

  return { items, total, page, pageSize, hasMore };
}

export async function getHelpCenterArticleById(
  id: string,
): Promise<HelpCenterArticle | null> {
  if (!id) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('cnt_contents')
    .select(
      `
        id,
        title,
        summary,
        description,
        content,
        content_type,
        content_subtype,
        category,
        tags,
        read_time,
        view_count,
        metadata,
        updated_at,
        published_at,
        status,
        content_url
      `,
    )
    .eq('id', id)
    .eq('status', 'Published')
    .in('content_subtype', HELP_CENTER_SUBTYPES)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRowToArticle(data as CntContentRow);
}

const ARTICLE_SELECT = `
  id,
  title,
  summary,
  description,
  content,
  content_type,
  content_subtype,
  category,
  tags,
  read_time,
  view_count,
  metadata,
  updated_at,
  published_at,
  status,
  content_url
`;

async function fetchRawArticle(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('cnt_contents')
    .select(ARTICLE_SELECT)
    .eq('id', id)
    .in('content_subtype', HELP_CENTER_SUBTYPES)
    .maybeSingle();
  if (error) throw error;
  return data as CntContentRow | null;
}

export async function createHelpCenterArticle(
  input: any,
): Promise<HelpCenterArticle> {
  const payload = normalizeHelpCenterPayload(input);
  const supabaseRow = buildSupabaseRow(payload, null);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('cnt_contents')
    .insert([{ id: payload.id, ...supabaseRow }])
    .select(ARTICLE_SELECT)
    .single();
  if (error) throw error;
  return mapRowToArticle(data as CntContentRow);
}

export async function updateHelpCenterArticle(
  id: string,
  input: any,
): Promise<HelpCenterArticle> {
  if (!id) throw new Error('id is required');
  const existing = await fetchRawArticle(id);
  if (!existing) {
    throw new Error('Article not found');
  }
  const normalizedDefaults: Partial<NormalizedHelpCenterPayload> = {
    id: existing.id,
    title: existing.title,
    description: existing.summary || existing.description,
    content: existing.content,
    category: existing.category,
    tags: existing.tags || [],
    readTime: existing.read_time,
    type: (existing.metadata?.hc_type as HelpCenterType) || 'Guide',
    difficulty: existing.metadata?.hc_difficulty || 'Beginner',
    steps: existing.metadata?.hc_steps || [],
    resources: existing.metadata?.hc_resources || [],
    videoUrl:
      existing.content_type === 'Video'
        ? existing.content_url
        : existing.metadata?.hc_video_url || null,
    status: (existing.status as 'Draft' | 'Published') || 'Draft',
    publishedAt: existing.published_at ? new Date(existing.published_at) : null,
  };

  const payload = normalizeHelpCenterPayload(input, normalizedDefaults);
  const supabaseRow = buildSupabaseRow(payload, existing.metadata);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('cnt_contents')
    .update(supabaseRow)
    .eq('id', id)
    .select(ARTICLE_SELECT)
    .single();
  if (error) throw error;
  return mapRowToArticle(data as CntContentRow);
}

export async function deleteHelpCenterArticle(id: string): Promise<void> {
  if (!id) return;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('cnt_contents')
    .delete()
    .eq('id', id)
    .in('content_subtype', HELP_CENTER_SUBTYPES);
  if (error) throw error;
}

export async function incrementArticleViewCount(id: string): Promise<void> {
  if (!id) return;
  const supabase = getSupabaseAdmin();

  try {
    const { error } = await supabase.rpc('increment_view_count', { content_id: id });
    if (error) throw error;
    return;
  } catch (rpcError) {
    const { data, error: fetchError } = await supabase
      .from('cnt_contents')
      .select('view_count')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) return;
    const nextCount = (data?.view_count || 0) + 1;
    await supabase.from('cnt_contents').update({ view_count: nextCount }).eq('id', id);
  }
}

export async function updateHelpfulCount(id: string, delta = 1): Promise<number> {
  if (!id) throw new Error('id required');
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('cnt_contents')
    .select('metadata')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Article not found');

  const metadata = (data.metadata ?? {}) as Record<string, any>;
  const current = Number.parseInt(metadata?.hc_helpful, 10);
  const next = Math.max(0, (Number.isFinite(current) ? current : 0) + delta);
  metadata.hc_helpful = next;

  const { error: updateError } = await supabase
    .from('cnt_contents')
    .update({ metadata })
    .eq('id', id);
  if (updateError) throw updateError;
  return next;
}

export { HELP_CENTER_SUBTYPES };
