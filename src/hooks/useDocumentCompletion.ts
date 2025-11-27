import { useState, useEffect } from 'react';
import { getUserDocuments } from '../services/DataverseService';
import { useProfileData } from './useProfileData';

interface DocumentCompletionData {
  documentCompletion: number;
  totalDocuments: number;
  uploadedDocuments: number;
  requiredDocuments: string[];
  missingDocuments: string[];
}

// Define mandatory documents that should be uploaded
const MANDATORY_DOCUMENTS = [
  'Commercial License',
  'Tax Registration Certificate', 
  'Articles of Association',
  'Memorandum of Association',
  'Bank Certificate',
];

export const useDocumentCompletion = (azureId?: string): DocumentCompletionData & { loading: boolean; error: string | null } => {
  const [completionData, setCompletionData] = useState<DocumentCompletionData>({
    documentCompletion: 0,
    totalDocuments: 0,
    uploadedDocuments: 0,
    requiredDocuments: [],
    missingDocuments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get profile data to determine company stage
  const { profileData } = useProfileData(azureId);

  useEffect(() => {
    const calculateDocumentCompletion = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!azureId) {
          // If no azureId, return default state
          setCompletionData({
            documentCompletion: 0,
            totalDocuments: MANDATORY_DOCUMENTS.length,
            uploadedDocuments: 0,
            requiredDocuments: MANDATORY_DOCUMENTS,
            missingDocuments: MANDATORY_DOCUMENTS,
          });
          setLoading(false);
          return;
        }

        // Get required documents (using mandatory documents list)
        const requiredDocuments = MANDATORY_DOCUMENTS;

        // Fetch uploaded documents from DataverseService
        const uploadedDocsData = await getUserDocuments(azureId);
        
        // Extract document names from uploaded documents
        const uploadedDocNames = uploadedDocsData.map((doc: { name?: string; fileName?: string }) => {
          // Normalize document names for comparison
          const name = doc.name || doc.fileName || '';
          return name.replace(/\.(pdf|docx?|xlsx?|png|jpe?g)$/i, '');
        });

        // Check which required documents have been uploaded
        const uploadedRequiredDocs = requiredDocuments.filter(reqDoc => {
          return uploadedDocNames.some(uploadedName => 
            uploadedName.toLowerCase().includes(reqDoc.toLowerCase()) ||
            reqDoc.toLowerCase().includes(uploadedName.toLowerCase())
          );
        });

        const missingDocuments = requiredDocuments.filter(
          doc => !uploadedRequiredDocs.includes(doc)
        );

        const documentCompletion = requiredDocuments.length > 0 
          ? Math.round((uploadedRequiredDocs.length / requiredDocuments.length) * 100)
          : 100;

        setCompletionData({
          documentCompletion,
          totalDocuments: requiredDocuments.length,
          uploadedDocuments: uploadedRequiredDocs.length,
          requiredDocuments,
          missingDocuments,
        });
      } catch (err) {
        console.error('Error calculating document completion:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate document completion');
        // Set default values on error
        setCompletionData({
          documentCompletion: 0,
          totalDocuments: MANDATORY_DOCUMENTS.length,
          uploadedDocuments: 0,
          requiredDocuments: MANDATORY_DOCUMENTS,
          missingDocuments: MANDATORY_DOCUMENTS,
        });
      } finally {
        setLoading(false);
      }
    };

    calculateDocumentCompletion();
  }, [azureId, profileData?.companyStage]);

  return {
    ...completionData,
    loading,
    error,
  };
};