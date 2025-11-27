import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  HelpCenterFilters,
  HelpCenterListResponse,
  HelpCenterArticle,
} from '../types/helpCenter';
import { mapApiArticleToHelpArticle } from '../types/helpCenter';

const HELP_CENTER_BASE = '/api/help-center/articles';

type ListQueryKey = ['help-center', 'list', HelpCenterFilters];
type DetailQueryKey = ['help-center', 'detail', string];

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...init,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const err = new Error(errorBody?.error || 'Request failed');
    (err as any).status = response.status;
    throw err;
  }
  return response.json();
}

function buildListUrl(filters: HelpCenterFilters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('q', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.type) params.set('type', filters.type);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  if (filters.tag) params.set('tag', filters.tag);
  const query = params.toString();
  return query ? `${HELP_CENTER_BASE}?${query}` : HELP_CENTER_BASE;
}

export function useHelpArticlesQuery(filters: HelpCenterFilters = {}) {
  return useQuery<HelpCenterListResponse, Error>({
    queryKey: ['help-center', 'list', filters] as ListQueryKey,
    queryFn: async () => {
      const data = await fetchJson<HelpCenterListResponse>(buildListUrl(filters));
      return {
        ...data,
        items: data.items.map(mapApiArticleToHelpArticle),
      };
    },
    staleTime: 60_000,
    keepPreviousData: true,
  });
}

export function useHelpArticleDetails(id?: string) {
  return useQuery<HelpCenterArticle | null, Error>({
    queryKey: ['help-center', 'detail', id] as DetailQueryKey,
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return null;
      const data = await fetchJson<HelpCenterArticle>(`${HELP_CENTER_BASE}/${id}`);
      return mapApiArticleToHelpArticle(data);
    },
  });
}

type HelpfulAction = 'increment' | 'decrement';

export function useMarkHelpful() {
  const queryClient = useQueryClient();

  return useMutation<
    { helpful: number },
    Error,
    { id: string; action?: HelpfulAction | number }
  >({
    mutationFn: async ({ id, action }) => {
      if (!id) throw new Error('id required');
      const body =
        typeof action === 'number'
          ? { delta: action }
          : { action: action ?? 'increment' };
      return fetchJson<{ helpful: number }>(`${HELP_CENTER_BASE}/${id}/helpful`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['help-center', 'detail', variables.id] as DetailQueryKey,
        (old: HelpCenterArticle | undefined) =>
          old ? { ...old, helpful: data.helpful } : old,
      );
      queryClient.invalidateQueries({
        queryKey: ['help-center', 'list'],
        exact: false,
      });
    },
  });
}
