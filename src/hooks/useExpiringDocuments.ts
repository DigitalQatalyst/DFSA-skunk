/**
 * React Query hook for fetching expiring documents
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';
import { DocumentDTO } from './useDocumentsQuery';

interface ExpiringDocumentsResponse {
  documents: DocumentDTO[];
  count: number;
}

/**
 * Fetch expiring documents from API (documents expiring within 30 days)
 */
async function fetchExpiringDocuments(
  token: string | null
): Promise<ExpiringDocumentsResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Fetch all documents and filter for expiring ones
  const expressServerUrl = import.meta.env.VITE_EXPRESS_SERVER_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');
  const url = `${expressServerUrl}/api/v1/documents`;
  
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

  const data = await response.json();
  const allDocuments = data.documents || [];
  
  // Filter documents expiring within 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  const expiringDocuments = allDocuments.filter((doc: DocumentDTO) => {
    if (!doc.expiryDate) return false;
    const expiry = new Date(doc.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Include documents expiring within 30 days (0-30 days)
    return diffDays <= 30 && diffDays >= 0;
  });

  return {
    documents: expiringDocuments,
    count: expiringDocuments.length,
  };
}

/**
 * React Query hook for expiring documents
 */
export function useExpiringDocuments(
  options?: Omit<UseQueryOptions<ExpiringDocumentsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const { user } = useAuth();
  
  return useQuery<ExpiringDocumentsResponse, Error>({
    queryKey: ['expiringDocuments'],
    queryFn: async () => {
      const token = await getAuthToken();
      return fetchExpiringDocuments(token);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes (expiring documents change frequently)
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
}

