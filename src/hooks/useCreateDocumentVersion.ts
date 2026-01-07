/**
 * React Query mutation hook for creating document versions
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';
import { DocumentVersionDTO } from './useDocumentVersions';
import { API_BASE_URL } from '../config/apiBase';

interface CreateDocumentVersionResponse {
  version: DocumentVersionDTO;
}

interface CreateDocumentVersionVariables {
  documentId: string;
  file: File;
}

/**
 * Create document version via Express server
 */
async function createDocumentVersion(
  token: string | null,
  variables: CreateDocumentVersionVariables
): Promise<CreateDocumentVersionResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  const formData = new FormData();
  formData.append('file', variables.file);

  // Use same-origin API base to avoid CORS in demo deployments.
  const url = `${API_BASE_URL}/documents/${variables.documentId}/versions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // Don't set Content-Type - browser will set it with boundary for multipart/form-data
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to create document version: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * React Query mutation hook for creating document versions
 */
export function useCreateDocumentVersion(
  options?: Omit<UseMutationOptions<CreateDocumentVersionResponse, Error, CreateDocumentVersionVariables>, 'mutationFn'>
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CreateDocumentVersionResponse, Error, CreateDocumentVersionVariables>({
    mutationFn: async (variables) => {
      const token = await getAuthToken();
      return createDocumentVersion(token, variables);
    },
    onSuccess: (data, variables) => {
      // Invalidate document details and versions queries
      queryClient.invalidateQueries({ queryKey: ['document', variables.documentId] });
      queryClient.invalidateQueries({ queryKey: ['documentVersions', variables.documentId] });
      // Also invalidate documents list
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    ...options,
  });
}

