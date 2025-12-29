import React from 'react';
import { XIcon, AlertTriangleIcon, ArrowRightIcon } from 'lucide-react';
import { useExpiringDocuments } from '../../hooks/useExpiringDocuments';
import { DocumentDTO } from '../../hooks/useDocumentsQuery';

export function DocumentNotification({ onClose }: { onClose: () => void; }) {
    const { data, isLoading, error } = useExpiringDocuments();
    const documents = data?.documents || [];
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
    // Calculate days until expiry
    const getDaysUntilExpiry = (expiryDate: string) => {
        if (!expiryDate) return null;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    // Sort documents by expiry date (closest first)
    const sortedDocuments = [...documents].sort((a, b) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
    return (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-700">
                    Expiring Documents
                </h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <XIcon size={16} />
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {isLoading && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        Loading expiring documents...
                    </div>
                )}
                {error && (
                    <div className="p-4 text-center text-sm text-red-500">
                        Failed to load expiring documents
                    </div>
                )}
                {!isLoading && !error && sortedDocuments.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No documents expiring soon
                    </div>
                )}
                {!isLoading && !error && sortedDocuments.map((doc: DocumentDTO) => {
                    const daysLeft = getDaysUntilExpiry(doc.expiryDate);
                    return (
                        <div
                            key={doc.id}
                            className="p-3 border-b border-gray-200 hover:bg-gray-50"
                        >
                            <div className="flex items-start">
                                <div className="flex-shrink-0 mt-0.5">
                                    <AlertTriangleIcon
                                        size={16}
                                        className={
                                            daysLeft && daysLeft <= 7 ? 'text-red-500' : 'text-yellow-500'
                                        }
                                    />
                                </div>
                                <div className="ml-2 flex-1">
                                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Expires on {formatDate(doc.expiryDate)}
                                    </p>
                                    <p className="text-xs font-medium mt-1">
                                        <span
                                            className={
                                                daysLeft && daysLeft <= 7 ? 'text-red-600' : 'text-yellow-600'
                                            }
                                        >
                                            {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-2 bg-gray-50 rounded-b-lg">
                <button
                    className="w-full text-xs text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 flex items-center justify-center"
                    onClick={onClose}
                >
                    View All Documents <ArrowRightIcon size={12} className="ml-1" />
                </button>
            </div>
        </div>
    );
}
