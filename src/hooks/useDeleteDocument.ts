/**
 * React Query mutation hook for deleting documents
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';

interface DeleteDocumentVariables {
  documentId: string;
}

/**
 * Delete document via middleware
 */
async function deleteDocument(
  token: string | null,
  documentId: string
): Promise<void> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  // Call Vercel function which handles blob deletion and then calls express for metadata
  const response = await fetch(`/api/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to delete document: ${response.statusText}`);
  }
}

/**
 * React Query mutation hook for deleting documents
 */
export function useDeleteDocument(
  options?: Omit<UseMutationOptions<void, Error, DeleteDocumentVariables>, 'mutationFn'>
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteDocumentVariables>({
    mutationFn: async (variables) => {
      const token = await getAuthToken();
      return deleteDocument(token, variables.documentId);
    },
    onSuccess: (_, variables) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documentVersions', variables.documentId] });
    },
    ...options,
  });
}

