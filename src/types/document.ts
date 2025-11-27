/**
 * Document reference type for form integration
 * Used to represent documents selected from Document Wallet
 */
export interface DocumentReference {
    type: 'document';
    id: string;
    url: string;
    name: string;
    category?: string;
    uploadDate?: string;
    fileType?: string;
}

/**
 * Union type for form field values that can be files or document references
 */
export type FileOrDocumentReference = File | DocumentReference;
export type FileOrDocumentReferenceArray = File[] | DocumentReference[];

