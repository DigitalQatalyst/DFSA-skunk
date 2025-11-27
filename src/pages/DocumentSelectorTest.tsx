import React, { useState } from 'react';
import { DocumentSelector, DocumentReference } from '../components/Forms/DocumentSelector';
import DashboardLayout from './dashboard/DashboardLayout';
import { FileIcon, CheckIcon, XIcon } from 'lucide-react';

export default function DocumentSelectorTest() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<File | DocumentReference | File[] | DocumentReference[] | null>(null);
    const [mode, setMode] = useState<'single' | 'multi'>('single');
    const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(['.pdf', '.doc', '.docx']);
    const [maxFiles, setMaxFiles] = useState(5);

    const handleSelect = (selection: File | File[] | DocumentReference | DocumentReference[] | null) => {
        setSelectedItem(selection);
        console.log('Selected:', selection);
    };

    const isDocumentReference = (item: any): item is DocumentReference => {
        return item && typeof item === 'object' && item.type === 'document';
    };

    const isFile = (item: any): item is File => {
        return item instanceof File;
    };

    const renderSelectedItem = () => {
        if (!selectedItem) return null;

        if (Array.isArray(selectedItem)) {
            return (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900">Selected Items ({selectedItem.length}):</h3>
                    {selectedItem.map((item, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            {isDocumentReference(item) ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FileIcon size={16} className="text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Document ID: {item.id}</p>
                                            <p className="text-xs text-gray-500">From Document Wallet</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FileIcon size={16} className="text-green-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                            <p className="text-xs text-gray-500">Size: {(item.size / 1024).toFixed(1)} KB</p>
                                            <p className="text-xs text-gray-500">New Upload</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        if (isDocumentReference(selectedItem)) {
            return (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <FileIcon size={20} className="text-blue-500 mt-1" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Selected Document</h3>
                                <p className="text-sm text-gray-700 mt-1">{selectedItem.name}</p>
                                <div className="mt-2 space-y-1 text-xs text-gray-500">
                                    <p><strong>ID:</strong> {selectedItem.id}</p>
                                    <p><strong>Category:</strong> {selectedItem.category || 'N/A'}</p>
                                    <p><strong>Upload Date:</strong> {selectedItem.uploadDate || 'N/A'}</p>
                                    <p><strong>File Type:</strong> {selectedItem.fileType || 'N/A'}</p>
                                    <p className="break-all"><strong>URL:</strong> {selectedItem.url}</p>
                                </div>
                            </div>
                        </div>
                        <CheckIcon size={20} className="text-green-500" />
                    </div>
                </div>
            );
        }

        if (isFile(selectedItem)) {
            return (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <FileIcon size={20} className="text-green-500 mt-1" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Selected File</h3>
                                <p className="text-sm text-gray-700 mt-1">{selectedItem.name}</p>
                                <div className="mt-2 space-y-1 text-xs text-gray-500">
                                    <p><strong>Size:</strong> {(selectedItem.size / 1024).toFixed(1)} KB</p>
                                    <p><strong>Type:</strong> {selectedItem.type}</p>
                                    <p><strong>Last Modified:</strong> {new Date(selectedItem.lastModified).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <CheckIcon size={20} className="text-green-500" />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <DashboardLayout
            onboardingComplete={true}
            setOnboardingComplete={() => {}}
            isLoggedIn={true}
            hideFormsMenu={true}
        >
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">DocumentSelector Test Page</h1>
                    <p className="text-gray-600 mb-6">
                        Test the DocumentSelector component in isolation. This page allows you to test both single and multi-file selection modes.
                    </p>

                    {/* Configuration Panel */}
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
                        
                        <div className="space-y-4">
                            {/* Mode Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selection Mode
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="single"
                                            checked={mode === 'single'}
                                            onChange={(e) => setMode(e.target.value as 'single' | 'multi')}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Single File</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="multi"
                                            checked={mode === 'multi'}
                                            onChange={(e) => setMode(e.target.value as 'single' | 'multi')}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Multi-File</span>
                                    </label>
                                </div>
                            </div>

                            {/* Allowed File Types */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allowed File Types
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'].map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={allowedFileTypes.includes(type)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setAllowedFileTypes([...allowedFileTypes, type]);
                                                    } else {
                                                        setAllowedFileTypes(allowedFileTypes.filter(t => t !== type));
                                                    }
                                                }}
                                                className="mr-1"
                                            />
                                            <span className="text-sm text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Max Files (for multi mode) */}
                            {mode === 'multi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Files
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={maxFiles}
                                        onChange={(e) => setMaxFiles(parseInt(e.target.value) || 5)}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Test Buttons */}
                    <div className="mb-6 flex space-x-4">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                        >
                            Open DocumentSelector
                        </button>
                        <button
                            onClick={() => {
                                setSelectedItem(null);
                                console.log('Selection cleared');
                            }}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
                        >
                            Clear Selection
                        </button>
                    </div>

                    {/* Selected Item Display */}
                    {selectedItem && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Selected Item</h2>
                            {renderSelectedItem()}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                            <li>Click "Open DocumentSelector" to open the modal</li>
                            <li>Try the "Select from Document Wallet" tab to see your account documents</li>
                            <li>Use the search to filter documents</li>
                            <li>Try the "Upload New File" tab to upload a new file</li>
                            <li>In multi-file mode, select multiple documents/files</li>
                            <li>Check the console for selection logs</li>
                            <li>Verify the selected item displays correctly below</li>
                        </ol>
                    </div>

                    {/* Debug Info */}
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Debug Information:</h3>
                        <pre className="text-xs text-gray-600 overflow-auto">
                            {JSON.stringify(
                                {
                                    mode,
                                    allowedFileTypes,
                                    maxFiles,
                                    hasSelection: !!selectedItem,
                                    selectionType: Array.isArray(selectedItem)
                                        ? 'array'
                                        : isDocumentReference(selectedItem)
                                        ? 'DocumentReference'
                                        : isFile(selectedItem)
                                        ? 'File'
                                        : 'null',
                                },
                                null,
                                2
                            )}
                        </pre>
                    </div>
                </div>

                {/* DocumentSelector Modal */}
                <DocumentSelector
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    onSelect={handleSelect}
                    mode={mode}
                    allowedFileTypes={allowedFileTypes}
                    maxFiles={maxFiles}
                    fieldLabel="test document"
                />
            </div>
        </DashboardLayout>
    );
}

