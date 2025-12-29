import React, { useState, useRef } from 'react';
import {
    UploadIcon,
    XIcon,
    FileIcon,
    CheckIcon,
    CalendarIcon,
    AlertCircleIcon,
} from 'lucide-react';
import { useAuth } from '../Header/context/AuthContext';
import { useCreateDocument } from '../../hooks/useCreateDocument';

export function DocumentUpload({ onClose, onUpload, categories }: { onClose: () => void, onUpload: (document: any) => void, categories: string[]; }) {
    const { user } = useAuth();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        category: categories[0] || '',
        description: '',
        expiryDate: '',
        tags: '',
        isConfidential: false,
    });
    const [errors, setErrors] = useState<any>({});
    const [warnings, setWarnings] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'uploading' | 'completing' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ✅ Use React Query mutation for document creation
    const createDocumentMutation = useCreateDocument({
        onSuccess: (data) => {
            console.log('✅ Document created successfully:', data.document);
            setUploadStatus('success');
            setUploadProgress(100);
            
            // Call the onUpload callback with the created document
            onUpload(data.document);
            
            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        },
        onError: (error) => {
            console.error('❌ Error creating document:', error);
            setUploadStatus('error');
            setErrors({ upload: error.message || 'Failed to upload document' });
            setIsUploading(false);
        },
    });

    // Handle drag events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setFormData({
                ...formData,
                name: droppedFile.name.split('.')[0],
            });
            setErrors({});
            setWarnings([]);
        }
    };
    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFormData({
                ...formData,
                name: selectedFile.name.split('.')[0],
            });
            setErrors({});
            setWarnings([]);
        }
    };
    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    // Format file size
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    // ✅ Upload file using React Query mutation
    const uploadToAzure = async () => {
        if (!file || !validateForm()) {
            return;
        }

        if (!user) {
            setErrors({ upload: 'User not authenticated. Please log in and try again.' });
            return;
        }

        let progressInterval: NodeJS.Timeout | null = null;
        try {
            setIsUploading(true);
            setUploadStatus('validating');
            setUploadProgress(0);
            setErrors({});
            setWarnings([]);

            console.log('🚀 Starting document upload...');
            console.log('File:', file.name, formatFileSize(file.size));
            console.log('Form data:', formData);

            // Simulate progress updates
            progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    const next = Math.min(prev + 10, 90);
                    if (next < 30) {
                        setUploadStatus('validating');
                    } else if (next < 80) {
                        setUploadStatus('uploading');
                    } else {
                        setUploadStatus('completing');
                    }
                    return next;
                });
            }, 200);

            // Use React Query mutation
            await createDocumentMutation.mutateAsync({
                file,
                name: formData.name,
                category: formData.category,
                description: formData.description || undefined,
                expiryDate: formData.expiryDate || undefined,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
                isConfidential: formData.isConfidential,
            });

            if (progressInterval) {
                clearInterval(progressInterval);
            }
            // onSuccess callback will handle the rest
        } catch (error: any) {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            setUploadStatus('error');
            setErrors({ upload: error.message || 'Failed to upload document. Please try again.' });
            setIsUploading(false);
        }
    };
    // Validate form
    const validateForm = () => {
        const newErrors: any = {};
        
        if (!file) {
            newErrors.file = 'Please select a file to upload';
        }
        
        if (!formData.name.trim()) {
            newErrors.name = 'Document name is required';
        }
        
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle form submission
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (validateForm()) {
            await uploadToAzure();
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Upload Document
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    {/* File Upload */}
                    {!file ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-6 ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                            // @ts-ignore
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <UploadIcon
                                size={32}
                                className={isDragging ? 'text-blue-500' : 'text-gray-400'}
                            />
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                <span className="font-medium text-blue-600">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                PDF, Word, Excel, PowerPoint, or image files (max 10MB)
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                            />
                            {errors.file && (
                                <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                            <div className="flex items-center">
                                <FileIcon size={24} className="text-gray-500 mr-3" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="text-gray-500 hover:text-red-500"
                                    onClick={() => setFile(null)}
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                            {uploadProgress > 0 && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="text-gray-600">
                                            {uploadStatus === 'validating' && 'Validating file...'}
                                            {uploadStatus === 'uploading' && 'Uploading to Azure Storage...'}
                                            {uploadStatus === 'completing' && 'Saving document record...'}
                                            {uploadStatus === 'success' && 'Upload complete!'}
                                            {uploadStatus === 'error' && 'Upload failed'}
                                        </span>
                                        <span className="text-gray-500">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                uploadStatus === 'success' ? 'bg-green-500' : 
                                                uploadStatus === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    {uploadStatus === 'success' && (
                                        <div className="flex items-center space-x-1 text-green-600 text-xs mt-1">
                                            <CheckIcon size={12} />
                                            <span>Document uploaded successfully!</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Document Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Document Name*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category*
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <CalendarIcon size={16} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="e.g. license, registration, compliance"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isConfidential"
                                    checked={formData.isConfidential}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                    Mark as confidential
                                </span>
                            </label>
                        </div>
                        {errors.submit && (
                            <div className="col-span-2">
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircleIcon size={16} />
                                    <span className="text-sm">{errors.submit}</span>
                                </div>
                            </div>
                        )}
                        {errors.upload && (
                            <div className="col-span-2">
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircleIcon size={16} />
                                    <span className="text-sm">{errors.upload}</span>
                                </div>
                            </div>
                        )}
                        {warnings.length > 0 && (
                            <div className="col-span-2">
                                <div className="space-y-1">
                                    {warnings.map((warning, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                                            <AlertCircleIcon size={16} />
                                            <span className="text-sm">{warning}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={isUploading || !file}
                        >
                            {isUploading ? (
                                uploadStatus === 'validating' ? 'Validating...' :
                                uploadStatus === 'uploading' ? 'Uploading...' :
                                uploadStatus === 'completing' ? 'Saving...' :
                                'Processing...'
                            ) : 'Upload Document'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
