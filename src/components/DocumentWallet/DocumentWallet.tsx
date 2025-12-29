import { useEffect, useState, useMemo, useRef, MutableRefObject } from 'react';
import { DocumentDashboard } from './DocumentDashboard';
import { DocumentTable } from './DocumentTable';
import { DocumentUpload } from './DocumentUpload';
import { DocumentDetail } from './DocumentDetail';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { useAuth } from '../Header/context/AuthContext';
import { useDocumentsQuery } from '../../hooks/useDocumentsQuery';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';
import { Can } from '../RBAC/Can';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { getCachedAccountId } from '../../services/UserProfileService';

interface DocumentWalletProps {
    onDocumentsUpdate?: (documents: any[]) => void;
    uploadModalOpenerRef?: MutableRefObject<(() => void) | null | undefined>;
}

export function DocumentWallet({ onDocumentsUpdate, uploadModalOpenerRef }: DocumentWalletProps = {}) {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    
    useEffect(() => {
        if (!uploadModalOpenerRef) return;
        uploadModalOpenerRef.current = () => setIsUploadModalOpen(true);
        return () => {
            if (uploadModalOpenerRef) {
                uploadModalOpenerRef.current = null;
            }
        };
    }, [uploadModalOpenerRef]);

    // ✅ Use React Query to fetch documents
    const { 
        data, 
        isLoading, 
        error: queryError, 
        refetch 
    } = useDocumentsQuery({
        search: searchTerm || undefined,
        category: activeFilter !== 'all' ? activeFilter : undefined,
    });

    // Memoize documents to prevent unnecessary re-renders
    const documents = useMemo(() => data?.documents || [], [data?.documents]);
    const error = queryError?.message || null;

    // ✅ Delete mutation
    const deleteMutation = useDeleteDocument({
        onSuccess: () => {
            console.log('✅ Document deleted, list will refresh automatically');
            // React Query will auto-refresh
        },
        onError: (error) => {
            console.error('❌ Error deleting document:', error);
        },
    });

    // Notify parent component of document updates
    // Use ref to avoid infinite loop if onDocumentsUpdate changes on every render
    const onDocumentsUpdateRef = useRef(onDocumentsUpdate);
    const documentsRef = useRef([]);
    
    useEffect(() => {
        onDocumentsUpdateRef.current = onDocumentsUpdate;
    }, [onDocumentsUpdate]);

    // Only call onDocumentsUpdate if documents actually changed (by ID comparison)
    useEffect(() => {
        const prevDocIds = (documentsRef.current || []).map(d => d?.id).filter(Boolean).sort().join(',');
        const currDocIds = (documents || []).map(d => d?.id).filter(Boolean).sort().join(',');
        
        if (prevDocIds !== currDocIds) {
            documentsRef.current = documents;
            onDocumentsUpdateRef.current?.(documents);
        }
    }, [documents]);

    // ✅ Client-side filtering (for status since it's computed)
    const filteredDocuments = useMemo(() => {
        let filtered = documents;
        
        // Search filter (if not handled by server)
        if (searchTerm) {
            filtered = filtered.filter((doc) => {
                const docTags = Array.isArray(doc.tags) ? doc.tags : [];
                return (
                    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    docTags.some((tag: string) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                );
            });
        }
        
        // Category filter (if not handled by server)
        if (activeFilter !== 'all') {
            filtered = filtered.filter((doc) => doc.category === activeFilter);
        }
        
        // Status filter (client-side since status is computed)
        if (statusFilter) {
            if (statusFilter === 'active') {
                filtered = filtered.filter((doc) => doc.status === 'Active');
            } else if (statusFilter === 'expired') {
                filtered = filtered.filter((doc) => {
                    if (!doc.expiryDate) return false;
                    const today = new Date();
                    const expiry = new Date(doc.expiryDate);
                    return expiry < today || doc.status === 'Expired';
                });
            } else if (statusFilter === 'expiring') {
                filtered = filtered.filter((doc) => {
                    if (!doc.expiryDate) return false;
                    const today = new Date();
                    const expiry = new Date(doc.expiryDate);
                    const diffTime = expiry.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 30 && diffDays >= 0;
                });
            }
        }
        
        return filtered;
    }, [documents, searchTerm, activeFilter, statusFilter]);
    // ✅ Calculate document statistics
    const documentStats = useMemo(() => {
        const expiringDocuments = documents.filter((doc) => {
            if (!doc.expiryDate) return false;
            const today = new Date();
            const expiry = new Date(doc.expiryDate);
            const diffTime = expiry.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays >= 0;
        });

        return {
            total: documents.length,
            active: documents.filter((doc) => doc.status === 'Active').length,
            expiring: expiringDocuments.length,
            expired: documents.filter((doc) => {
                if (!doc.expiryDate) return false;
                const today = new Date();
                const expiry = new Date(doc.expiryDate);
                return expiry < today || doc.status === 'Expired';
            }).length,
        };
    }, [documents]);
    // Handle filter by status from dashboard cards
    const handleFilterByStatus = (status: any) => {
        // Toggle filter if clicking the same status again
        setStatusFilter(statusFilter === status ? null : status);
    };
    
    // Define static categories list (matches upload form categories)
    const staticCategories = [
        'Licensing',
        'Legal',
        'Certifications',
        'Compliance',
        'Insurance',
        'Facilities',
        'Tax',
        'HR'
    ];
    
    // Get unique categories for filter - combine static categories with any custom categories from documents
    const documentCategories = new Set(documents.map((doc) => doc.category));
    const allCategories = [...staticCategories, ...Array.from(documentCategories).filter(cat => !staticCategories.includes(cat))];
    const categories = ['all', ...allCategories];
    
    // ✅ Handle document upload - React Query will auto-refresh
    const handleDocumentUpload = async (newDocument: any) => {
        console.log('📄 Document uploaded:', newDocument.name);
        console.log('   Status:', newDocument.status);
        console.log('   Category:', newDocument.category);
        console.log('   Uploaded By:', newDocument.uploadedBy);
        console.log('🔄 Refreshing document list...');
        
        // React Query will automatically refetch when mutation completes
        // But we can force a refetch here to be sure
        await refetch();
        console.log('✅ Document list refreshed');
    };
    // ✅ Handle document replacement - React Query will auto-refresh
    const handleDocumentReplace = async (docId: string, newVersion: any) => {
        console.log('📄 Document replaced:', docId);
        // React Query will automatically refetch when mutation completes
        // Force a refetch to get the updated document
        await refetch();
        setSelectedDocument(null);
    };
    // ✅ Handle document deletion - use React Query mutation
    const handleDocumentDelete = async (docId: string) => {
        console.log('🗑️ Deleting document:', docId);
        
        const docToDelete = documents.find((doc) => doc.id === docId);
        if (!docToDelete) {
            console.error('❌ Document not found:', docId);
            return;
        }

        if (!confirm(`Are you sure you want to delete "${docToDelete.name}"?`)) {
            return;
        }

        // Use React Query mutation - it will handle the API call and auto-refresh
        deleteMutation.mutate({ documentId: docId });
        setSelectedDocument(null);
    };
    // Toggle filter expansion for mobile
    const toggleFilterExpansion = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };
    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading documents...</p>
                </div>
            </div>
        );
    }
    // Error state
    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-2">Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mx-6">
            {/* Dashboard Summary - 2x2 grid on mobile */}
            <div className="px-4 md:px-6 pt-4 md:pt-6">
                <DocumentDashboard
                    stats={documentStats}
                    onFilterByStatus={handleFilterByStatus}
                    activeFilter={statusFilter}
                />
            </div>

            {/* Search and Filters - Compact for mobile */}
            <div className="px-4 md:px-6 pt-4">
                <div className="md:flex md:flex-row md:gap-4 md:items-center">
                    {/* Mobile Search with Filter Toggle */}
                    <div className="relative flex-1 mb-4 md:mb-0">
                        <div className="flex items-center">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <SearchIcon size={18} />
                                </div>
                            </div>
                            <button
                                className="ml-3 p-3 text-gray-500 border border-gray-300 rounded-md md:hidden"
                                onClick={toggleFilterExpansion}
                                aria-label="Toggle filters"
                            >
                                <FilterIcon size={18} />
                            </button>
                            {/* Manual Refresh Button */}
                            <button
                                className="ml-3 px-3 py-3 text-blue-600 border border-blue-300 bg-blue-50 rounded-md text-sm font-medium hover:bg-blue-100"
                                onClick={() => {
                                    console.log('🔄 Manual refresh triggered');
                                    refetch();
                                }}
                                title="Force refresh document list"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        {/* Mobile Expanded Filter */}
                        {isFilterExpanded && (
                            <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-200 p-4 md:hidden">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Filters
                                    </span>
                                    <button
                                        onClick={toggleFilterExpansion}
                                        className="p-2 text-gray-500 hover:text-gray-700"
                                    >
                                        <XIcon size={16} />
                                    </button>
                                </div>
                                <label className="block text-sm text-gray-500 mb-2">
                                    Category:
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                                    value={activeFilter}
                                    onChange={(e) => {
                                        setActiveFilter(e.target.value);
                                        setIsFilterExpanded(false);
                                    }}
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category}
                                        </option>
                                    ))}
                                </select>
                                {(searchTerm || activeFilter !== 'all' || statusFilter) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setActiveFilter('all');
                                            setStatusFilter(null);
                                            setIsFilterExpanded(false);
                                        }}
                                        className="w-full py-3 text-sm text-blue-600 border border-blue-300 rounded-md bg-blue-50 hover:bg-blue-100"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Desktop Filter */}
                    <div className="hidden md:flex md:items-center md:gap-3">
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                            <FilterIcon size={16} className="inline mr-1" /> Filter:
                        </span>
                        <select
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {filteredDocuments.length === 0 && (
                <div className="mx-4 md:mx-6 my-4 md:my-6 text-center py-10 md:py-12 border border-gray-200 rounded-lg">
                    <div className="text-gray-400 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No documents found
                    </h3>
                    <p className="text-gray-500 mb-5 px-6 max-w-md mx-auto">
                        {searchTerm || activeFilter !== 'all' || statusFilter
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : 'Upload your first document to get started.'}
                    </p>
                    {searchTerm || activeFilter !== 'all' || statusFilter ? (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setActiveFilter('all');
                                setStatusFilter(null);
                            }}
                            className="inline-flex items-center px-5 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Clear all filters
                        </button>
                    ) : (
                        <Can I="create" a="user-documents" passThrough>
                            {(allowed) => {
                                const button = (
                                    <button
                                        onClick={allowed ? () => setIsUploadModalOpen(true) : undefined}
                                        disabled={!allowed}
                                        className={`inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
                                            !allowed ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        aria-disabled={!allowed}
                                    >
                                        Upload a document
                                    </button>
                                );

                                if (!allowed) {
                                    return (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="inline-block">{button}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>You don't have permission to upload documents</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    );
                                }

                                return button;
                            }}
                        </Can>
                    )}
                </div>
            )}

            {/* Document Table */}
            {filteredDocuments.length > 0 && (
                <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2">
                    <DocumentTable
                        documents={filteredDocuments}
                        onViewDocument={setSelectedDocument}
                    />
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <DocumentUpload
                    onClose={() => setIsUploadModalOpen(false)}
                    onUpload={handleDocumentUpload}
                    categories={categories.filter((c) => c !== 'all')}
                />
            )}

            {/* Document Detail Modal */}
            {selectedDocument && (
                <DocumentDetail
                    document={selectedDocument}
                    onClose={() => setSelectedDocument(null)}
                    onReplace={handleDocumentReplace}
                    onDelete={handleDocumentDelete}
                />
            )}
        </div>
    );
}
