/**
 * React Query hook for fetching documents
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';

export interface DocumentsQueryParams {
  search?: string;
  category?: string;
}

export interface DocumentDTO {
  id: string;
  name: string;
  category: string;
  description?: string;
  expiryDate?: string | null;
  tags?: string[];
  isConfidential: boolean;
  status: string;
  organisation: string;
  latestVersion: number;
  fileUrl?: string;
  fileType?: string;
  uploadDate?: string;
  uploadedBy?: string;
}

interface DocumentsResponse {
  documents: DocumentDTO[];
  count: number;
}

/**
 * Fetch documents from middleware
 */
async function fetchDocuments(
  token: string | null,
  params?: DocumentsQueryParams
): Promise<DocumentsResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);

  // Use express server directly for metadata operations
  // Use localhost:5000 in development, or env variable, or production URL
  const expressServerUrl = import.meta.env.VITE_EXPRESS_SERVER_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
  const url = `${expressServerUrl}/api/v1/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * React Query hook for documents
 */
export function useDocumentsQuery(
  params?: DocumentsQueryParams,
  options?: Omit<UseQueryOptions<DocumentsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();
  
  return useQuery<DocumentsResponse, Error>({
    queryKey: ['documents', params?.search, params?.category],
    queryFn: async () => {
      const token = await getAuthToken();
      return fetchDocuments(token, params);
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

