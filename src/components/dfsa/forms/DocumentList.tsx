/**
 * DFSA Financial Services Application - Document List Component
 *
 * Displays uploaded documents with preview, download, and delete functionality.
 * Uses localStorage-based storage.
 *
 * Requirements: 4.4, 4.5
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  FileIcon,
  FileText,
  FileSpreadsheet,
  Image,
  Trash2,
  Download,
  Eye,
  X,
  AlertCircle,
  Calendar,
  HardDrive
} from 'lucide-react';
import {
  StoredDocument,
  deleteDocument,
  downloadDocument,
  createDocumentDownloadUrl,
  formatFileSize
} from './documentStorage';

export interface DocumentListProps {
  /** List of documents to display */
  documents: StoredDocument[];
  /** Callback when a document is deleted */
  onDocumentDeleted?: (documentId: string) => void;
  /** Whether delete is allowed */
  allowDelete?: boolean;
  /** Whether download is allowed */
  allowDownload?: boolean;
  /** Whether preview is allowed */
  allowPreview?: boolean;
  /** Whether the list is read-only */
  readOnly?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Title for the list */
  title?: string;
  /** Whether to show compact view */
  compact?: boolean;
}

/**
 * Gets the appropriate icon for a file type
 */
function getFileIcon(mimeType: string): React.ReactNode {
  if (mimeType === 'application/pdf') {
    return <FileText size={20} className="text-red-600" />;
  }
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
    return <FileSpreadsheet size={20} className="text-green-600" />;
  }
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return <FileText size={20} className="text-blue-600" />;
  }
  if (mimeType.startsWith('image/')) {
    return <Image size={20} className="text-purple-600" />;
  }
  return <FileIcon size={20} className="text-gray-600" />;
}

/**
 * Formats date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Document Preview Modal Component
 */
interface PreviewModalProps {
  document: StoredDocument;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ document, onClose }) => {
  const previewUrl = useMemo(() => {
    return createDocumentDownloadUrl(document);
  }, [document]);

  // Cleanup URL on unmount
  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            {getFileIcon(document.mimeType)}
            <span className="font-medium text-gray-900 truncate max-w-md">
              {document.originalName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close preview"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
          {isImage && (
            <img
              src={previewUrl}
              alt={document.originalName}
              className="max-w-full h-auto mx-auto rounded"
            />
          )}

          {isPdf && (
            <iframe
              src={previewUrl}
              title={document.originalName}
              className="w-full h-[70vh] border rounded"
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center py-12">
              <FileIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                Preview not available for this file type
              </p>
              <p className="text-sm text-gray-500">
                Click download to view the file
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {formatFileSize(document.fileSize)} • {document.mimeType.split('/')[1]?.toUpperCase()}
          </div>
          <button
            onClick={() => downloadDocument(document)}
            className="flex items-center gap-2 px-4 py-2 bg-[#9b1823] text-white rounded-md hover:bg-[#7a1319] transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Single Document Item Component
 */
interface DocumentItemProps {
  document: StoredDocument;
  onDelete?: (id: string) => void;
  onPreview?: (doc: StoredDocument) => void;
  allowDelete: boolean;
  allowDownload: boolean;
  allowPreview: boolean;
  compact: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  onDelete,
  onPreview,
  allowDelete,
  allowDownload,
  allowPreview,
  compact
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    const success = deleteDocument(document.id);
    if (success) {
      onDelete?.(document.id);
    }
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  }, [document.id, onDelete]);

  const handleDownload = useCallback(() => {
    downloadDocument(document);
  }, [document]);

  const handlePreview = useCallback(() => {
    onPreview?.(document);
  }, [document, onPreview]);

  if (compact) {
    return (
      <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {getFileIcon(document.mimeType)}
          <span className="text-sm text-gray-700 truncate" title={document.originalName}>
            {document.originalName}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            ({formatFileSize(document.fileSize)})
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {allowPreview && (
            <button
              onClick={handlePreview}
              className="p-1.5 text-gray-500 hover:text-[#9b1823] hover:bg-gray-200 rounded transition-colors"
              title="Preview"
              aria-label={`Preview ${document.originalName}`}
            >
              <Eye size={16} />
            </button>
          )}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="p-1.5 text-gray-500 hover:text-[#9b1823] hover:bg-gray-200 rounded transition-colors"
              title="Download"
              aria-label={`Download ${document.originalName}`}
            >
              <Download size={16} />
            </button>
          )}
          {allowDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete"
              aria-label={`Delete ${document.originalName}`}
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-600" size={24} />
                <h3 className="font-semibold text-gray-900">Delete Document?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{document.originalName}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
          {getFileIcon(document.mimeType)}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate" title={document.originalName}>
            {document.originalName}
          </h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HardDrive size={12} />
              {formatFileSize(document.fileSize)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(document.uploadDate)}
            </span>
            <span className="uppercase">
              {document.mimeType.split('/')[1]?.split('.').pop() || 'file'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {allowPreview && (
            <button
              onClick={handlePreview}
              className="p-2 text-gray-500 hover:text-[#9b1823] hover:bg-gray-100 rounded-md transition-colors"
              title="Preview"
              aria-label={`Preview ${document.originalName}`}
            >
              <Eye size={18} />
            </button>
          )}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-[#9b1823] hover:bg-gray-100 rounded-md transition-colors"
              title="Download"
              aria-label={`Download ${document.originalName}`}
            >
              <Download size={18} />
            </button>
          )}
          {allowDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
              aria-label={`Delete ${document.originalName}`}
              disabled={isDeleting}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h3 className="font-semibold text-gray-900">Delete Document?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{document.originalName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Document List Component
 */
export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDocumentDeleted,
  allowDelete = true,
  allowDownload = true,
  allowPreview = true,
  readOnly = false,
  emptyMessage = 'No documents uploaded yet',
  title,
  compact = false
}) => {
  const [previewDocument, setPreviewDocument] = useState<StoredDocument | null>(null);

  const handleDelete = useCallback((documentId: string) => {
    onDocumentDeleted?.(documentId);
  }, [onDocumentDeleted]);

  const handlePreview = useCallback((doc: StoredDocument) => {
    setPreviewDocument(doc);
  }, []);

  const closePreview = useCallback(() => {
    setPreviewDocument(null);
  }, []);

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileIcon size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {title} ({documents.length})
        </h3>
      )}

      <div className={compact ? 'space-y-2' : 'space-y-3'}>
        {documents.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            onDelete={handleDelete}
            onPreview={handlePreview}
            allowDelete={allowDelete && !readOnly}
            allowDownload={allowDownload}
            allowPreview={allowPreview}
            compact={compact}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewDocument && (
        <PreviewModal document={previewDocument} onClose={closePreview} />
      )}
    </div>
  );
};

export default DocumentList;
