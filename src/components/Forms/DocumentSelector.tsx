import React, { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
    FileIcon,
    FileTextIcon,
    ImageIcon,
    UploadIcon,
    SearchIcon,
    XIcon,
    CheckIcon,
} from 'lucide-react';
import { getAccountDocuments } from '../../services/DataverseService';
import { getCachedAccountId } from '../../services/UserProfileService';
import { useAuth } from '../Header/context/AuthContext';
import { secureUploadService } from '../../services/SecureUploadService';

export interface DocumentReference {
    type: 'document';
    id: string;
    url: string;
    name: string;
    category?: string;
    uploadDate?: string;
    fileType?: string;
}

export interface DocumentSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (selection: File | File[] | DocumentReference | DocumentReference[] | null) => void;
    mode: 'single' | 'multi';
    allowedFileTypes?: string[]; // e.g., ['.pdf', '.doc', '.docx']
    maxFiles?: number; // For multi-file mode
    maxFileSize?: number; // In bytes
    fieldLabel?: string; // For display purposes
}

export function DocumentSelector({
    open,
    onOpenChange,
    onSelect,
    mode = 'single',
    allowedFileTypes = [],
    maxFiles = 5,
    maxFileSize = 5242880, // 5MB default
    fieldLabel = 'document',
}: DocumentSelectorProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'select' | 'upload'>('select');
    const [documents, setDocuments] = useState<any[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
    const [uploadedDocuments, setUploadedDocuments] = useState<DocumentReference[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch documents from Document Wallet (using same pattern as DocumentWallet)
    const fetchAccountDocuments = useCallback(async () => {
        if (!user?.id) {
            console.log('⚠️ No user ID available, skipping document fetch');
            setError('User not authenticated');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            console.log('🔄 [DocumentSelector] Fetching account ID for user:', user.id);
            
            // Step 1: Get account ID from user ID
            let accountId: string;
            try {
                accountId = await getCachedAccountId(user.id, user.email);
                console.log('✅ [DocumentSelector] Account ID retrieved:', accountId);
            } catch (error) {
                console.error('❌ [DocumentSelector] Failed to get account ID:', error);
                setError('Failed to retrieve account information. Please try again.');
                setIsLoading(false);
                return;
            }
            
            // Step 2: Fetch ALL documents for this account (not just user's)
            console.log('🔄 [DocumentSelector] Fetching documents from account:', accountId);
            const data = await getAccountDocuments(accountId); // No userId filter = show all
            console.log('📄 [DocumentSelector] Documents fetched:', data.length, 'documents from account');
            
            // Always update state with fetched data
            const fetchedDocuments = data || [];
            
            console.log('🔄 [DocumentSelector] Updating documents state...');
            console.log('   Fetched:', fetchedDocuments.length, 'documents');
            console.log('   Document IDs:', fetchedDocuments.map(d => d.id));
            
            // Filter by file type if specified (after fetching all documents)
            let filtered = fetchedDocuments;
            if (allowedFileTypes.length > 0) {
                console.log('🔍 [DocumentSelector] Filtering by file types:', allowedFileTypes);
                filtered = fetchedDocuments.filter((doc: any) => {
                    if (!doc.fileType && !doc.fileUrl && !doc.name) {
                        console.log('   ⚠️ Document missing file info:', doc.id, doc.name);
                        return false;
                    }
                    
                    // Extract file extension - prioritize filename (most reliable), then fileUrl, then fileType
                    const fileType = doc.fileType || '';
                    const fileUrl = doc.fileUrl || '';
                    const fileName = doc.name || '';
                    
                    // Get extension from various sources (prioritize filename)
                    let extension = '';
                    
                    // 1. Try filename first (most reliable)
                    if (fileName) {
                        const parts = fileName.split('.');
                        if (parts.length > 1) {
                            extension = parts[parts.length - 1]?.toLowerCase() || '';
                        }
                    }
                    
                    // 2. Try fileUrl if filename didn't work
                    if (!extension && fileUrl) {
                        const urlParts = fileUrl.split('.');
                        if (urlParts.length > 1) {
                            // Get last part before query params
                            const lastPart = urlParts[urlParts.length - 1]?.split('?')[0]?.toLowerCase() || '';
                            if (lastPart && lastPart.length <= 5) { // Valid extension length
                                extension = lastPart;
                            }
                        }
                    }
                    
                    // 3. Try fileType only if it's a MIME type (contains '/')
                    if (!extension && fileType) {
                        // MIME type like "application/pdf" -> "pdf"
                        if (fileType.includes('/')) {
                            extension = fileType.split('/')[1]?.toLowerCase() || '';
                        }
                        // If fileType is just "image", "pdf", etc. (category), ignore it
                        // We need actual file extension, not category
                    }
                    
                    // Normalize extension (remove dot if present, ensure lowercase)
                    extension = extension.replace('.', '').toLowerCase().trim();
                    
                    // Debug logging
                    if (allowedFileTypes.length > 0) {
                        console.log(`   📄 ${doc.name}:`, {
                            fileType: fileType || 'none',
                            fileName: fileName || 'none',
                            fileUrl: fileUrl ? fileUrl.substring(0, 50) + '...' : 'none',
                            extractedExtension: extension || 'none'
                        });
                    }
                    
                    // Check if extension matches allowed types
                    const matches = allowedFileTypes.some(type => {
                        const cleanType = type.replace('.', '').toLowerCase();
                        // Direct match
                        if (extension === cleanType) return true;
                        // Handle common variations
                        if (cleanType === 'jpg' && (extension === 'jpg' || extension === 'jpeg')) return true;
                        if (cleanType === 'jpeg' && (extension === 'jpg' || extension === 'jpeg')) return true;
                        // MIME type matching (only if fileType is a proper MIME type)
                        if (fileType && fileType.includes('/') && fileType.includes(cleanType)) return true;
                        return false;
                    });
                    
                    if (!matches) {
                        console.log(`   ❌ Document filtered out: ${doc.name} (extension: ${extension || 'none'}, fileType: ${fileType || 'none'})`);
                    } else {
                        console.log(`   ✅ Document matches: ${doc.name} (extension: ${extension})`);
                    }
                    return matches;
                });
                console.log(`✅ [DocumentSelector] After filtering: ${filtered.length} documents match allowed types`);
            }
            
            // Force synchronous state update to ensure immediate rendering (same as DocumentWallet)
            flushSync(() => {
                setDocuments(filtered);
                setFilteredDocuments(filtered);
            });
            
            console.log('✅ [DocumentSelector] flushSync completed - state updates are now rendered');
            
            if (filtered.length === 0) {
                console.log('📭 [DocumentSelector] No documents found' + (allowedFileTypes.length > 0 ? ' matching file type filter' : ''));
            } else {
                console.log(`✅ [DocumentSelector] Successfully loaded ${filtered.length} document(s) from account ${accountId}`);
            }
            
            setIsLoading(false);
        } catch (err: any) {
            console.error('❌ [DocumentSelector] Error fetching documents:', err);
            setError(err.message || 'Failed to load documents from Document Wallet');
            setIsLoading(false);
            setDocuments([]);
            setFilteredDocuments([]);
        }
    }, [user?.id, user?.email, allowedFileTypes]);

    // Filter documents by search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredDocuments(documents);
            return;
        }

        const filtered = documents.filter((doc) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                doc.name?.toLowerCase().includes(searchLower) ||
                doc.category?.toLowerCase().includes(searchLower) ||
                doc.description?.toLowerCase().includes(searchLower) ||
                (Array.isArray(doc.tags) && doc.tags.some((tag: string) => 
                    tag.toLowerCase().includes(searchLower)
                ))
            );
        });
        setFilteredDocuments(filtered);
    }, [searchTerm, documents]);

    // Fetch documents when modal opens or when switching to select tab
    useEffect(() => {
        if (open && activeTab === 'select') {
            fetchAccountDocuments();
        }
    }, [open, activeTab, fetchAccountDocuments]);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setActiveTab('select');
            setSearchTerm('');
            setSelectedFile(null);
            setFileError(null);
            setSelectedDocuments([]);
            setUploadedDocuments([]);
            setError(null);
            setIsUploading(false);
            setUploadProgress(0);
        }
    }, [open]);

    // Handle document selection
    const handleDocumentSelect = (document: any) => {
        const docRef: DocumentReference = {
            type: 'document',
            id: document.id,
            url: document.fileUrl,
            name: document.name,
            category: document.category,
            uploadDate: document.uploadDate,
            fileType: document.fileType,
        };

        if (mode === 'single') {
            onSelect(docRef);
            onOpenChange(false);
        } else {
            // Multi-file mode
            if (selectedDocuments.some(d => d.id === document.id)) {
                // Deselect if already selected
                const updated = selectedDocuments.filter(d => d.id !== document.id);
                setSelectedDocuments(updated);
            } else {
                // Check max files limit
                const totalSelected = selectedDocuments.length + uploadedDocuments.length;
                if (totalSelected >= maxFiles) {
                    setError(`Maximum ${maxFiles} files allowed. Remove a file to select more.`);
                    return;
                }
                setSelectedDocuments([...selectedDocuments, document]);
            }
        }
    };

    // Handle file selection for upload (supports multiple files)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setFileError(null);

        // Validate each file
        const validFiles: File[] = [];
        for (const file of files) {
            // Validate file size
            if (maxFileSize && file.size > maxFileSize) {
                setFileError(
                    `${file.name}: File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum allowed size of ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`
                );
                continue;
            }

            // Validate file type
            if (allowedFileTypes.length > 0) {
                const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                if (!allowedFileTypes.includes(fileExtension)) {
                    setFileError(
                        `${file.name}: File type ${fileExtension} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`
                    );
                    continue;
                }
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) {
            return;
        }

        if (mode === 'single') {
            setSelectedFile(validFiles[0]);
        } else {
            // Multi-file mode: check if we can add more files
            const totalSelected = selectedDocuments.length + uploadedDocuments.length;
            const remainingSlots = maxFiles - totalSelected;
            if (validFiles.length > remainingSlots) {
                setFileError(`You can only add ${remainingSlots} more file(s). Maximum ${maxFiles} files total.`);
                e.target.value = '';
                return;
            }
            // In multi-file mode, we'll upload files one by one or let user upload manually
            // For now, just set the first file as selectedFile for manual upload
            // User can upload it, then select more
            setSelectedFile(validFiles[0]);
            if (validFiles.length > 1) {
                setFileError(`Multiple files selected. Upload "${validFiles[0].name}" first, then select more files.`);
            }
            // Reset file input
            e.target.value = '';
        }
    };

    // Upload file to Document Wallet
    const uploadFileToWallet = async (file: File): Promise<DocumentReference | null> => {
        if (!user?.id) {
            setFileError('User not authenticated');
            return null;
        }

        try {
            setIsUploading(true);
            setUploadProgress(0);
            setFileError(null);

            const result = await secureUploadService.uploadFile({
                file,
                userId: user.id,
                userEmail: user.email,
                category: 'Form Attachments', // Default category for form uploads
                description: `Uploaded from form: ${fieldLabel}`,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                },
            });

            if (result.success && result.document) {
                const docRef: DocumentReference = {
                    type: 'document',
                    id: result.document.id,
                    url: result.document.fileUrl || result.fileUrl || '',
                    name: result.document.name || file.name,
                    category: result.document.category,
                    uploadDate: result.document.uploadDate,
                    fileType: (result.document as any).fileType || file.type || undefined,
                };
                
                // Refresh document list if on select tab
                if (activeTab === 'select') {
                    await fetchAccountDocuments();
                }
                
                return docRef;
            } else {
                setFileError(result.error || 'Upload failed');
                return null;
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setFileError(err.message || 'Upload failed');
            return null;
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Handle file upload confirmation (single file mode)
    const handleFileConfirm = async () => {
        if (!selectedFile) {
            setFileError('Please select a file');
            return;
        }

        // Upload file to Document Wallet first
        const uploadedDoc = await uploadFileToWallet(selectedFile);
        if (!uploadedDoc) {
            return; // Error already set
        }

        if (mode === 'single') {
            onSelect(uploadedDoc);
            onOpenChange(false);
        }
    };

    // Handle adding file to multi-file selection (after upload)
    const handleAddUploadedFile = async () => {
        if (!selectedFile) {
            setFileError('Please select a file');
            return;
        }

        const totalSelected = selectedDocuments.length + uploadedDocuments.length;
        if (totalSelected >= maxFiles) {
            setFileError(`Maximum ${maxFiles} files allowed. Remove a file to upload more.`);
            return;
        }

        // Upload file to Document Wallet
        const uploadedDoc = await uploadFileToWallet(selectedFile);
        if (!uploadedDoc) {
            return; // Error already set
        }

        setUploadedDocuments([...uploadedDocuments, uploadedDoc]);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    // Handle final selection (for multi-file mode)
    const handleConfirmSelection = () => {
        if (mode === 'multi') {
            const allSelections: DocumentReference[] = [
                ...selectedDocuments.map(doc => ({
                    type: 'document' as const,
                    id: doc.id,
                    url: doc.fileUrl,
                    name: doc.name,
                    category: doc.category,
                    uploadDate: doc.uploadDate,
                    fileType: doc.fileType,
                })),
                ...uploadedDocuments,
            ];
            onSelect(allSelections);
            onOpenChange(false);
        }
    };

    // Remove selected document (multi-file mode)
    const handleRemoveDocument = (docId: string) => {
        setSelectedDocuments(selectedDocuments.filter(d => d.id !== docId));
    };

    // Note: handleRemoveFile removed - we now use uploadedDocuments instead of selectedFiles

    // Remove uploaded document (multi-file mode)
    const handleRemoveUploadedDocument = (docId: string) => {
        setUploadedDocuments(uploadedDocuments.filter(d => d.id !== docId));
    };

    // Get file icon
    const getFileIcon = (fileType?: string) => {
        if (!fileType) return <FileIcon size={16} className="text-gray-500" />;
        if (fileType.includes('pdf')) return <FileTextIcon size={16} className="text-red-500" />;
        if (fileType.includes('image')) return <ImageIcon size={16} className="text-blue-500" />;
        return <FileIcon size={16} className="text-gray-500" />;
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const totalSelected = selectedDocuments.length + uploadedDocuments.length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'single' 
                            ? `Select ${fieldLabel}` 
                            : `Select ${fieldLabel}s (${totalSelected}/${maxFiles})`}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'single'
                            ? 'Choose an existing document from your Document Wallet or upload a new file'
                            : `Select up to ${maxFiles} documents from your Document Wallet or upload new files`}
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'select' | 'upload')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="select">Select from Document Wallet</TabsTrigger>
                        <TabsTrigger value="upload">Upload New File</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Select from Document Wallet */}
                    <TabsContent value="select" className="space-y-4 mt-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                                {error}
                            </div>
                        )}

                        {/* Search */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search documents by name, category, or tags..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Loading state */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <span className="text-gray-600">Loading documents...</span>
                            </div>
                        )}

                        {/* Documents list */}
                        {!isLoading && filteredDocuments.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <FileIcon size={48} className="mx-auto mb-2 text-gray-400" />
                                <p>No documents found in your Document Wallet</p>
                                {allowedFileTypes.length > 0 && (
                                    <p className="text-sm mt-1">
                                        (Filtered by file types: {allowedFileTypes.join(', ')})
                                    </p>
                                )}
                            </div>
                        )}

                        {!isLoading && filteredDocuments.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="max-h-96 overflow-y-auto">
                                    {filteredDocuments.map((doc) => {
                                        const isSelected = selectedDocuments.some(d => d.id === doc.id);
                                        return (
                                            <div
                                                key={doc.id}
                                                className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                    isSelected ? 'bg-blue-50 border-blue-200' : ''
                                                }`}
                                                onClick={() => handleDocumentSelect(doc)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        {getFileIcon(doc.fileType)}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                    {doc.name}
                                                                </h4>
                                                                {isSelected && (
                                                                    <CheckIcon size={16} className="text-blue-600 flex-shrink-0" />
                                                                )}
                                                            </div>
                                                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                                                                <span>{doc.category || 'Uncategorized'}</span>
                                                                <span>•</span>
                                                                <span>{formatDate(doc.uploadDate)}</span>
                                                                {doc.fileSize && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{formatFileSize(parseInt(doc.fileSize))}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {doc.description && (
                                                                <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                                                                    {doc.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Selected items summary (multi-file mode) */}
                        {mode === 'multi' && totalSelected > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Selected ({totalSelected}/{maxFiles}):
                                </h4>
                                <div className="space-y-2">
                                    {selectedDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {getFileIcon(doc.fileType)}
                                                <span className="text-sm text-gray-700">{doc.name}</span>
                                                <span className="text-xs text-gray-500">(from Document Wallet)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XIcon size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {uploadedDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {getFileIcon(doc.fileType)}
                                                <span className="text-sm text-gray-700">{doc.name}</span>
                                                <span className="text-xs text-gray-500">(uploaded to Document Wallet)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveUploadedDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XIcon size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* Tab 2: Upload New File */}
                    <TabsContent value="upload" className="space-y-4 mt-4">
                        {fileError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                                {fileError}
                            </div>
                        )}

                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {allowedFileTypes.length > 0 
                                            ? `Allowed: ${allowedFileTypes.join(', ')}`
                                            : 'All file types'}
                                        {maxFileSize && ` • Max ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`}
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept={allowedFileTypes.join(',')}
                                    multiple={mode === 'multi'}
                                />
                            </label>
                        </div>

                        {/* Upload progress */}
                        {isUploading && (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Uploading to Document Wallet...</p>
                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedFile && !isUploading && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {getFileIcon(selectedFile.type)}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {mode === 'multi' && (
                                            <button
                                                type="button"
                                                onClick={handleAddUploadedFile}
                                                disabled={totalSelected >= maxFiles}
                                                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            >
                                                Upload to Wallet
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setFileError(null);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <XIcon size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selected files summary (multi-file mode) */}
                        {mode === 'multi' && uploadedDocuments.length > 0 && (
                            <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                    Uploaded to Document Wallet ({uploadedDocuments.length}/{maxFiles}):
                                </h4>
                                <div className="space-y-2">
                                    {uploadedDocuments.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {getFileIcon(doc.fileType)}
                                                <span className="text-sm text-gray-700">{doc.name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveUploadedDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <XIcon size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    {mode === 'single' ? (
                        activeTab === 'select' ? (
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedDocuments.length > 0) {
                                        handleDocumentSelect(selectedDocuments[0]);
                                    }
                                }}
                                disabled={selectedDocuments.length === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Select Document
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleFileConfirm}
                                disabled={!selectedFile}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Use File
                            </button>
                        )
                    ) : (
                        <button
                            type="button"
                            onClick={handleConfirmSelection}
                            disabled={totalSelected === 0}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm Selection ({totalSelected}/{maxFiles})
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

