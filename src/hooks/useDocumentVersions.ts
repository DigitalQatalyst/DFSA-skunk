/**
 * React Query hook for fetching document versions
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';
import { API_BASE_URL } from '../config/apiBase';

export interface DocumentVersionDTO {
  id: string;
  documentId: string;
  versionNumber: number;
  blobPath: string;
  filename: string;
  fileExtension?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedOn?: string;
}

interface DocumentVersionsResponse {
  versions: DocumentVersionDTO[];
  count: number;
}

/**
 * Fetch document versions from middleware
 */
async function fetchDocumentVersions(
  token: string | null,
  documentId: string
): Promise<DocumentVersionsResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Use same-origin API base to avoid CORS in demo deployments.
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/versions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch document versions: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * React Query hook for document versions
 */
export function useDocumentVersions(
  documentId: string | null | undefined,
  options?: Omit<UseQueryOptions<DocumentVersionsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery<DocumentVersionsResponse, Error>({
    queryKey: ['documentVersions', documentId],
    queryFn: async () => {
      const token = await getAuthToken();
      return fetchDocumentVersions(token, documentId!);
    },
    enabled: !!user && !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

