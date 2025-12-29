import React, { useState, useRef } from 'react';
import {
    UploadIcon,
    XIcon,
    FileIcon,
    CheckIcon,
    AlertCircleIcon,
} from 'lucide-react';
import { secureUploadService, UploadOptions } from '../../services/SecureUploadService';

interface DocumentUploadProps {
    onClose: () => void;
    onUpload: (document: any) => void;
    categories: string[];
    userId: string; // User's Azure/MSAL ID
    userEmail?: string; // User's email for organization-info API
}

export function DocumentUpload({ onClose, onUpload, categories, userId, userEmail }: DocumentUploadProps) {
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

    // Get file type from extension
    const getFileType = (filename: string) => {
        if (!filename) return 'file';
        const ext = filename.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
        if (['pdf'].includes(ext || '')) return 'pdf';
        if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'spreadsheet';
        if (['ppt', 'pptx'].includes(ext || '')) return 'presentation';
        if (['doc', 'docx', 'txt'].includes(ext || '')) return 'document';
        return 'file';
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Validate form data
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

    // Upload file using secure upload service
    const uploadToAzure = async () => {
        if (!file || !validateForm()) {
            return;
        }

        try {
            setIsUploading(true);
            setUploadStatus('validating');
            setUploadProgress(0);
            setErrors({});
            setWarnings([]);

            console.log('🚀 Starting secure upload process...');
            console.log('User ID:', userId);
            console.log('File:', file.name, formatFileSize(file.size));
            console.log('Form data:', formData);

            const uploadOptions: UploadOptions = {
                file,
                userId,
                userEmail, // ✅ Added userEmail for organization-info API
                category: formData.category,
                description: formData.description,
                onProgress: (progress) => {
                    setUploadProgress(progress);
                    
                    // Update status based on progress
                    if (progress < 30) {
                        setUploadStatus('validating');
                    } else if (progress < 80) {
                        setUploadStatus('uploading');
                    } else {
                        setUploadStatus('completing');
                    }
                }
            };

            const result = await secureUploadService.uploadFile(uploadOptions);

            if (result.success && result.document) {
                setUploadStatus('success');
                setUploadProgress(100);
                
                // Show warnings if any
                if (result.warnings && result.warnings.length > 0) {
                    setWarnings(result.warnings);
                }

                console.log('✅ Upload successful:', result.document);
                
                // Call the onUpload callback with the created document
                onUpload(result.document);
                
                // Close the modal after a short delay
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setUploadStatus('error');
                setErrors({ upload: result.error || 'Upload failed' });
                console.error('❌ Upload failed:', result.error);
            }

        } catch (error: any) {
            setUploadStatus('error');
            setErrors({ upload: error.message || 'Upload failed' });
            console.error('❌ Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFile(null);
        setFormData({
            name: '',
            category: categories[0] || '',
            description: '',
            expiryDate: '',
            tags: '',
            isConfidential: false,
        });
        setErrors({});
        setWarnings([]);
        setUploadProgress(0);
        setUploadStatus('idle');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isUploading}
                    >
                        <XIcon size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* File Upload Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select File
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                isDragging
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {file ? (
                                <div className="space-y-2">
                                    <FileIcon size={48} className="mx-auto text-blue-500" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-gray-500">
                                            {formatFileSize(file.size)} • {getFileType(file.name)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={resetForm}
                                        className="text-sm text-red-600 hover:text-red-800"
                                        disabled={isUploading}
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <UploadIcon size={48} className="mx-auto text-gray-400" />
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">Drop your file here or click to browse</p>
                                        <p className="text-gray-500">Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, images</p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                                disabled={isUploading}
                            />
                        </div>
                        {errors.file && (
                            <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                        )}
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {uploadStatus === 'validating' && 'Validating file...'}
                                    {uploadStatus === 'uploading' && 'Uploading to Azure Storage...'}
                                    {uploadStatus === 'completing' && 'Saving document record...'}
                                </span>
                                <span className="text-gray-500">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {uploadStatus === 'success' && (
                        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                            <CheckIcon size={20} />
                            <span className="text-sm font-medium">Document uploaded successfully!</span>
                        </div>
                    )}

                    {/* Warnings */}
                    {warnings.length > 0 && (
                        <div className="space-y-1">
                            {warnings.map((warning, index) => (
                                <div key={index} className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-2 rounded">
                                    <AlertCircleIcon size={16} />
                                    <span className="text-sm">{warning}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error Messages */}
                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-1">
                            {Object.entries(errors).map(([key, error]) => (
                                <div key={key} className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
                                    <AlertCircleIcon size={16} />
                                    <span className="text-sm">{error as string}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Document Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter document name"
                                disabled={isUploading}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isUploading}
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter document description"
                            disabled={isUploading}
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isConfidential"
                            checked={formData.isConfidential}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={isUploading}
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Mark as confidential
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isUploading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={uploadToAzure}
                        disabled={isUploading || !file}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </div>
            </div>
        </div>
    );
}
