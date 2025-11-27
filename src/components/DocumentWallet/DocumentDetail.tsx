import React, { useState, useRef } from 'react';
import {
    XIcon,
    FileTextIcon,
    FileIcon,
    ImageIcon,
    FileSpreadsheetIcon,
    DownloadIcon,
    TrashIcon,
    ClockIcon,
    UploadIcon,
    CheckIcon,
    TagIcon,
    LockIcon,
    CalendarIcon,
    UserIcon,
    InfoIcon,
} from 'lucide-react';
import {
    getBlobNameFromUrl,
    generateDownloadSasUrl,
} from '../../services/AzureBlobService';
import { useAuth } from '../Header';
import { useDocumentDetails } from '../../hooks/useDocumentDetails';
import { useDocumentVersions } from '../../hooks/useDocumentVersions';
import { useCreateDocumentVersion } from '../../hooks/useCreateDocumentVersion';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';
import { useQueryClient } from '@tanstack/react-query';

import { Can } from '../RBAC/Can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export function DocumentDetail({ document, onClose, onReplace, onDelete }: { document: any, onClose: () => void, onReplace: (id: string, version: any) => void, onDelete: (id: string) => void; }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    // Fetch document details using React Query
    const { data: documentData, isLoading: isLoadingDocument, error: documentError } = useDocumentDetails(document?.id);
    const { data: versionsData, isLoading: isLoadingVersions, error: versionsError } = useDocumentVersions(document?.id);
    
    // Use fetched data or fallback to prop
    const currentDocument = documentData?.document || document;
    const versions = versionsData?.versions || [];
    
    // Mutations
    const createVersionMutation = useCreateDocumentVersion({
        onSuccess: () => {
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['document', document.id] });
            queryClient.invalidateQueries({ queryKey: ['documentVersions', document.id] });
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            setIsProcessing(false);
            setUploadProgress(0);
            setIsReplacing(false);
            setNewFile(null);
            if (onReplace) {
                onReplace(document.id, { versionNumber: versions.length + 1 });
            }
        },
        onError: (error) => {
            console.error('Error creating document version:', error);
            setIsProcessing(false);
            setError('Failed to replace document. Please try again.');
            setUploadProgress(0);
        },
    });
    
    const deleteDocumentMutation = useDeleteDocument({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            setIsProcessing(false);
            setShowDeleteConfirm(false);
            if (onDelete) {
                onDelete(document.id);
            }
            onClose();
        },
        onError: (error) => {
            console.error('Error deleting document:', error);
            setIsProcessing(false);
            setError('Failed to delete document. Please try again.');
        },
    });
    const [isReplacing, setIsReplacing] = useState(false);
    const [newFile, setNewFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef(null);
    // Get icon based on file type
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return <FileTextIcon size={24} className="text-red-500" />;
            case 'image':
                return <ImageIcon size={24} className="text-blue-500" />;
            case 'spreadsheet':
                return <FileSpreadsheetIcon size={24} className="text-green-500" />;
            default:
                return <FileIcon size={24} className="text-gray-500" />;
        }
    };
    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };
    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setNewFile(selectedFile);
            handleReplaceFile(selectedFile);
        }
    };
    // Handle file replacement using React Query mutation
    const handleReplaceFile = async (file: File) => {
        let progressInterval: NodeJS.Timeout | null = null;
        try {
            setIsProcessing(true);
            setError(null);
            
            // Simulate progress updates
            progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        if (progressInterval) clearInterval(progressInterval);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 200);
            
            // Use React Query mutation to create new version
            await createVersionMutation.mutateAsync({
                documentId: document.id,
                file: file,
            });
            
            // Complete the progress
            if (progressInterval) clearInterval(progressInterval);
            setUploadProgress(100);
        } catch (error) {
            console.error('Error replacing document:', error);
            if (progressInterval) clearInterval(progressInterval);
            setIsProcessing(false);
            setError('Failed to replace document. Please try again.');
            setUploadProgress(0);
        }
    };
    // Handle document deletion using React Query mutation
    const handleDocumentDelete = async () => {
        try {
            setIsProcessing(true);
            setError(null);
            
            // Use React Query mutation to delete document
            // This handles both blob deletion and metadata deletion
            await deleteDocumentMutation.mutateAsync({
                documentId: document.id,
            });
        } catch (error) {
            console.error('Error deleting document:', error);
            setIsProcessing(false);
            setError('Failed to delete document. Please try again.');
        }
    };
    // Generate a download URL with SAS token
    const handleDownload = async (fileUrl: string) => {
        try {
            // Get the blob name from the URL
            const blobName = getBlobNameFromUrl(fileUrl);
            // Get user ID for authentication (fallback to 'default-user' if not available)
            const userId = user?.id || user?.email || 'default-user';
            // Generate a SAS URL for downloading
            const downloadUrl = await generateDownloadSasUrl(blobName, userId);
            
            const filename = preferredFilename || blobName.split('/').pop() || 'download';

            // Attempt fetch + blob download first (better user experience), fallback to opening the SAS URL
            try {
                const response = await fetch(downloadUrl);
                if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = window.document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                window.document.body.appendChild(link);
                link.click();
                window.document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } catch (fetchErr) {
                console.warn('Fetch download failed, falling back to direct link:', fetchErr);
                const link = window.document.createElement('a');
                link.href = downloadUrl;
                link.download = filename;
                link.target = '_blank';
                link.rel = 'noopener';
                window.document.body.appendChild(link);
                link.click();
                window.document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error generating download URL:', error);
            setError('Failed to generate download link. Please try again.');
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {isLoadingDocument ? 'Loading...' : (currentDocument?.name || document?.name || 'Document')}
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'versions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('versions')}
                    >
                        Version History (
                        {isLoadingVersions ? '...' : (() => {
                            const latestVersionNumber = currentDocument?.latestVersion || document?.latestVersion || 1;
                            const currentVersionExists = versions?.some((v: any) => v.versionNumber === latestVersionNumber);
                            // Count: versions from API + current version if not already in list
                            return currentVersionExists ? (versions?.length || 0) : ((versions?.length || 0) + 1);
                        })()})
                    </button>
                </div>
                {(error || documentError || versionsError) && (
                    <div className="bg-red-50 p-3 border-b border-red-200">
                        <p className="text-sm text-red-600">
                            {error || documentError?.message || versionsError?.message || 'An error occurred'}
                        </p>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    {isLoadingDocument ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading document details...
                        </div>
                    ) : activeTab === 'details' ? (
                        <div className="p-4">
                            {/* Document Preview */}
                            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center">
                                {getFileIcon(currentDocument?.fileType || document?.fileType || 'file')}
                                <div className="ml-3 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {currentDocument?.name || document?.name}
                                        </span>
                                        {currentDocument?.isConfidential && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                <LockIcon size={10} className="mr-1" /> Confidential
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {currentDocument?.fileSize || document?.fileSize} • Uploaded{' '}
                                        {formatDate(currentDocument?.uploadDate || document?.uploadDate)}
                                    </p>
                                </div>
                                <Can I="download" a="user-documents" this={{ isConfidential: document.isConfidential }} passThrough>
                                    {(allowed) => {
                                        const button = (
                                            <button
                                                className="text-blue-600 hover:text-blue-800 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => allowed && handleDownload(document.fileUrl)}
                                                disabled={!allowed}
                                            >
                                                <DownloadIcon size={18} />
                                            </button>
                                        );
                                        
                                        if (!allowed && document.isConfidential) {
                                            return (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            {button}
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Only admins can download confidential documents</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        }
                                        
                                        return button;
                                    }}
                                </Can>
                            </div>
                            {/* Document Metadata */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Category</p>
                                    <p className="text-sm text-gray-800">{currentDocument?.category || document?.category || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <p className="text-sm">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${(currentDocument?.status || document?.status) === 'Active' ? 'bg-green-100 text-green-800' : (currentDocument?.status || document?.status) === 'Pending' ? 'bg-yellow-100 text-yellow-800' : (currentDocument?.status || document?.status) === 'Expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {currentDocument?.status || document?.status || 'Unknown'}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <CalendarIcon size={14} className="mr-1 text-gray-400" />
                                        {formatDate(currentDocument?.uploadDate || document?.uploadDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <ClockIcon size={14} className="mr-1 text-gray-400" />
                                        {formatDate(currentDocument?.expiryDate || document?.expiryDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Uploaded By</p>
                                    <p className="text-sm text-gray-800 flex items-center">
                                        <UserIcon size={14} className="mr-1 text-gray-400" />
                                        {currentDocument?.uploadedBy || document?.uploadedBy || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">File Type</p>
                                    <p className="text-sm text-gray-800">
                                        {((currentDocument?.fileType || document?.fileType) || '').charAt(0).toUpperCase() +
                                            ((currentDocument?.fileType || document?.fileType) || '').slice(1)}
                                    </p>
                                </div>
                                {(currentDocument?.tags || document?.tags) && (currentDocument?.tags || document?.tags).length > 0 && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                                            <TagIcon size={14} className="mr-1" /> Tags
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(currentDocument?.tags || document?.tags).map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(currentDocument?.description || document?.description) && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                                            <InfoIcon size={14} className="mr-1" /> Description
                                        </p>
                                        <p className="text-sm text-gray-800 whitespace-pre-line">
                                            {currentDocument?.description || document?.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {/* Replace File Section */}
                            {isReplacing ? (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Replace Document
                                        </h3>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setIsReplacing(false);
                                                setNewFile(null);
                                                setUploadProgress(0);
                                            }}
                                            disabled={isProcessing}
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                    {!newFile ? (
                                        <div
                                            className={`border-2 border-dashed border-blue-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
                                            onClick={() =>

                                                !isProcessing && fileInputRef.current.click()
                                            }
                                        >
                                            <UploadIcon size={24} className="text-blue-500" />
                                            <p className="mt-2 text-sm text-blue-600 text-center">
                                                Click to upload a new version
                                            </p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                                                disabled={isProcessing}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex items-center">
                                                <FileIcon size={20} className="text-blue-500 mr-3" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-blue-700">
                                                        {newFile.name}
                                                    </p>
                                                    <p className="text-xs text-blue-500">
                                                        {newFile.size < 1024 * 1024
                                                            ? (newFile.size / 1024).toFixed(1) + ' KB'
                                                            : (newFile.size / (1024 * 1024)).toFixed(1) +
                                                            ' MB'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-1.5 rounded-full"
                                                        style={{
                                                            width: `${uploadProgress}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-blue-600">
                                                        {uploadProgress}%
                                                    </span>
                                                    {uploadProgress === 100 && (
                                                        <span className="text-xs text-green-500 flex items-center">
                                                            <CheckIcon size={12} className="mr-1" /> Complete
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex gap-2 mb-6">
                                    <button
                                        className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50"
                                        onClick={() => setIsReplacing(true)}
                                        disabled={isProcessing}
                                    >
                                        <UploadIcon size={16} className="mr-1" />
                                        Replace Document
                                    </button>
                                    <button
                                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        disabled={isProcessing}
                                    >
                                        <TrashIcon size={16} className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            )}
                            {/* Delete Confirmation */}
                            {showDeleteConfirm && (
                                <div className="bg-red-50 rounded-lg p-4 border border-red-200 mb-6">
                                    <h3 className="text-sm font-medium text-red-800 mb-2">
                                        Confirm Deletion
                                    </h3>
                                    <p className="text-sm text-red-600 mb-3">
                                        Are you sure you want to delete this document? This action
                                        cannot be undone.
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isProcessing}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                                            onClick={handleDocumentDelete}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : isLoadingVersions ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading version history...
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Version History
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {(() => {
                                        // Get the latest version number from the document
                                        const latestVersionNumber = currentDocument?.latestVersion || document?.latestVersion || 1;
                                        
                                        // Start with all versions from the API
                                        let allVersions = [...(versions || [])];
                                        
                                        // Check if the current version exists in the versions list
                                        const currentVersionExists = allVersions.some((v: any) => v.versionNumber === latestVersionNumber);
                                        
                                        // If current version doesn't exist in the list (e.g., document was never replaced),
                                        // add the current document as version 1
                                        if (!currentVersionExists && latestVersionNumber > 0) {
                                            allVersions.push({
                                                id: 'current',
                                                versionNumber: latestVersionNumber,
                                                filename: currentDocument?.name || document?.name,
                                                uploadedBy: currentDocument?.uploadedBy || document?.uploadedBy || 'Unknown',
                                                uploadedOn: currentDocument?.uploadDate || document?.uploadDate,
                                                blobPath: currentDocument?.fileUrl || document?.fileUrl,
                                                isCurrent: true,
                                            });
                                        }
                                        
                                        // Sort by version number (descending - newest first)
                                        allVersions.sort((a: any, b: any) => {
                                            const aVersion = a.versionNumber || 0;
                                            const bVersion = b.versionNumber || 0;
                                            return bVersion - aVersion;
                                        });
                                        
                                        if (allVersions.length === 0) {
                                            return (
                                                <div className="p-6 text-center text-gray-500">
                                                    <p className="text-sm">No versions available</p>
                                                    <p className="text-xs text-gray-400 mt-1">Upload a document to see version history</p>
                                                </div>
                                            );
                                        }
                                        
                                        return allVersions.map((version: any, index: number) => {
                                            // The version matching latestVersionNumber is the latest
                                            const isLatest = version.versionNumber === latestVersionNumber;
                                            return (
                                                <div key={version.id || `version-${version.versionNumber}-${index}`} className="p-4">
                                                    <div className="flex items-start">
                                                        <div className={`flex-shrink-0 rounded-full p-2 ${isLatest ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                            <FileIcon size={16} className={isLatest ? 'text-blue-600' : 'text-gray-600'} />
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex items-center">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    Version {version.versionNumber || (allVersions.length - index + 1)}
                                                                </p>
                                                                {isLatest && (
                                                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                                                        Latest
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                Uploaded {formatDate(version.uploadedOn)} by{' '}
                                                                {version.uploadedBy || 'Unknown'}
                                                            </p>
                                                            {version.filename && (
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    {version.filename}
                                                                </p>
                                                            )}
                                                            <div className="mt-2 flex gap-2">
                                                                <button
                                                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                                                    onClick={() => {
                                                                        // For current/latest version, use document's fileUrl
                                                                        // For older versions, use blobPath to reconstruct URL
                                                                        if (version.isCurrent || isLatest) {
                                                                            const downloadUrl = currentDocument?.fileUrl || document?.fileUrl || version.blobPath;
                                                                            handleDownload(downloadUrl);
                                                                        } else if (version.blobPath) {
                                                                            // For older versions, blobPath contains filename
                                                                            // We'll need to reconstruct the full blob URL (handled by handleDownload)
                                                                            handleDownload(version.blobPath);
                                                                        }
                                                                    }}
                                                                >
                                                                    <DownloadIcon size={12} className="mr-1" />{' '}
                                                                    Download
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
