/**
 * React Query mutation hook for creating documents
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '../components/Header/context/AuthContext';
import { getAuthToken } from '../utils/getAuthToken';
import { DocumentDTO } from './useDocumentsQuery';
import { API_BASE_URL } from '../config/apiBase';

interface CreateDocumentResponse {
  document: DocumentDTO;
}

interface CreateDocumentVariables {
  file: File;
  name: string;
  category: string;
  description?: string;
  expiryDate?: string;
  tags?: string[];
  isConfidential?: boolean;
}

/**
 * Create document via middleware
 */
async function createDocument(
  token: string | null,
  variables: CreateDocumentVariables
): Promise<CreateDocumentResponse> {
  if (!token) {
    throw new Error('No authentication token available');
  }

  const formData = new FormData();
  formData.append('file', variables.file);
  formData.append('name', variables.name);
  formData.append('category', variables.category);
  if (variables.description) formData.append('description', variables.description);
  if (variables.expiryDate) formData.append('expiryDate', variables.expiryDate);
  if (variables.tags) formData.append('tags', variables.tags.join(','));
  if (variables.isConfidential !== undefined) {
    formData.append('isConfidential', variables.isConfidential.toString());
  }

  // Use same-origin API base to avoid CORS in demo deployments.
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to create document: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * React Query mutation hook for creating documents
 */
export function useCreateDocument(
  options?: Omit<UseMutationOptions<CreateDocumentResponse, Error, CreateDocumentVariables>, 'mutationFn'>
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<CreateDocumentResponse, Error, CreateDocumentVariables>({
    mutationFn: async (variables) => {
      const token = await getAuthToken();
      return createDocument(token, variables);
    },
    onSuccess: () => {
      // Invalidate documents query to refetch list
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    ...options,
  });
}

