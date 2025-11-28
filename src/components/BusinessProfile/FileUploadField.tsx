import React, { useState } from "react";
import { UploadIcon, FileIcon, XIcon, Loader2 } from "lucide-react";
import {getBlobNameFromUrl, uploadFileToBlobStorage,
    generateDownloadSasUrl, deleteBlob as deleteBlobClient } from "../../services/AzureBlobService";
import {useAuth} from "../Header";


interface FileUploadFieldProps {
    value?: string; // The URL of the uploaded file
    onChange: (url: string | null) => void;
    placeholder?: string;
    isMandatory?: boolean;
    isInvalid?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
                                                                    value,
                                                                    onChange,
                                                                    placeholder,
                                                                    isMandatory,
                                                                    isInvalid,
                                                                }) => {
    const { user } = useAuth();

    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState("");


    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setFileName(file.name);

        try {
            // Actual Azure upload
            const uploadedUrl = await uploadFileToBlobStorage(file);

            // Pass the permanent URL string back to the parent component (TabSection)
            onChange(uploadedUrl);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Sorry, the file upload didn't work. Please try again.");
            onChange(null);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleRemove = async () => {
        if (value) {
            try {
                //Get the simple file path (blobName) from the full URL
                const blobName = getBlobNameFromUrl(value);

                // delete the file
                await deleteBlobClient(blobName);
                console.log(`Successfully deleted blob: ${blobName}`);

            } catch (error) {
                console.error("Failed to delete blob from Azure:", error);
            }
        }

        // Clear the URL from the form
        onChange(null);
        setFileName("");
    };

    // Handle secure viewing process
    const handleViewDocument = async (e: React.MouseEvent) => {
        e.preventDefault(); // Stop the link from trying to open the old, locked URL

        if (!value) return;

        if (!user || !user.id) {
            alert("Please log in to view the document.");
            return;
        }

        try {
            // get the file path
            const blobName = getBlobNameFromUrl(value);

            //  acquire the temporary access token (SAS URL)
            const secureDownloadUrl = await generateDownloadSasUrl(
                blobName,
                user.id,
                user.email,
            );

            // STEP 3: Use the token to allow us open the document
            window.open(secureDownloadUrl, '_blank');

        } catch (error) {
            console.error('Secure view failed:', error);
            alert("Could not open document. You may not have permission.");
        }
    };


    // If file is already uploaded (has a URL)
    if (value) {
        return (
            <div className={`w-full border rounded px-3 py-2 min-h-[44px] flex items-center justify-between ${
                isInvalid ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
            }`}>
                <div className="flex items-center flex-1 min-w-0">
                    <FileIcon size={16} className="mr-2 flex-shrink-0" style={{ color: '#9b1823' }} />
                    <a
                        onClick={handleViewDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline truncate cursor-pointer"
                        style={{ color: '#9b1823' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#7a1319'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#9b1823'}
                    >
                        {fileName || "View Document"}
                    </a>
                </div>

                <button
                    type="button"
                    onClick={handleRemove}
                    className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded flex-shrink-0"
                    aria-label="Remove file"
                >
                    <XIcon size={16} />
                </button>
            </div>
        );
    }
    // If currently uploading
    if (isUploading) {
        return (
            <div className="w-full border rounded px-3 py-2 min-h-[44px] flex items-center" style={{ borderColor: '#9b1823', backgroundColor: '#9b18232a' }}>
                <Loader2 size={16} className="animate-spin mr-2" style={{ color: '#9b1823' }} />
                <span className="text-sm" style={{ color: '#9b1823' }}>Uploading {fileName}...</span>
            </div>
        );
    }

    // Upload button (no file yet)
    return (
        <div className="relative">
            <label
                className={`w-full border-2 border-dashed rounded px-3 py-2 min-h-[44px] flex items-center justify-center cursor-pointer transition-colors ${
                    isInvalid
                        ? "border-red-300 bg-red-50 hover:border-red-400"
                        : "border-gray-300 bg-white"
                }`}
                onMouseEnter={(e) => !isInvalid && (e.currentTarget.style.borderColor = '#9b1823', e.currentTarget.style.backgroundColor = '#9b18232a')}
                onMouseLeave={(e) => !isInvalid && (e.currentTarget.style.borderColor = '#d1d5db', e.currentTarget.style.backgroundColor = 'white')}
            >
                <UploadIcon size={16} className="text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
          {placeholder || (isMandatory ? "Upload required file" : "Upload file")}
        </span>
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
            </label>
        </div>
    );
};