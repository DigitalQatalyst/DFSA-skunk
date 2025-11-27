/**
 * React Query hook for fetching a single document
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';

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
  uploadDate?: string;
  uploadedBy?: string;
}

interface DocumentResponse {
  document: DocumentDTO;
}

/**
 * Fetch single document from middleware
 */
async function fetchDocument(token: string | null, documentId: string): Promise<DocumentResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Use express server directly for metadata operations
  // Use localhost:5000 in development, or env variable, or production URL
  const expressServerUrl = import.meta.env.VITE_EXPRESS_SERVER_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
  const response = await fetch(`${expressServerUrl}/api/v1/documents/${documentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * React Query hook for document details
 */
export function useDocumentDetails(
  documentId: string | null | undefined,
  options?: Omit<UseQueryOptions<DocumentResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();

  return useQuery<DocumentResponse, Error>({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const token = await getAuthToken();
      return fetchDocument(token, documentId!);
    },
    enabled: !!user && !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

