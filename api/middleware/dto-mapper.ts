/**
 * DTO Mapper
 * Maps Dataverse entities to frontend DTOs
 */

import { calculateDocumentStatus } from './business-logic.js';

/**
 * Document DTO interface matching frontend needs
 */
export interface DocumentDTO {
  id: string;
  name: string;
  category: string;
  description?: string;
  expiryDate?: string | null;
  tags?: string[];
  isConfidential: boolean;
  status: string;
  organisation: string;
  latestVersion: number;
  fileUrl?: string;
  uploadDate?: string;
  uploadedBy?: string;
}

/**
 * Document Version DTO
 */
export interface DocumentVersionDTO {
  id: string;
  documentId: string;
  versionNumber: number;
  blobPath: string;
  filename: string;
  fileExtension?: string;
  fileSize?: number;
  uploadedBy?: string;
  uploadedOn?: string;
}

/**
 * Map Dataverse document entity to DTO
 */
export function mapDocumentToDTO(dataverseRecord: any): DocumentDTO {
  // Map actual Dataverse fields to DTO
  // Use kf_documentname instead of kf_name
  // Use kf_documentstatus or compute from statecode/statuscode
  // Use _createdby_value for uploadedBy
  // Use _kf_account_value or _owningbusinessunit_value for organisation
  // Use kf_fileversionnumber or kf_versionnumber for latestVersion
  
  return {
    id: dataverseRecord.kf_documentid || dataverseRecord.id,
    name: dataverseRecord.kf_documentname || dataverseRecord.kf_name || dataverseRecord.name || '',
    category: dataverseRecord.kf_category || dataverseRecord.category || '',
    description: dataverseRecord.kf_description || dataverseRecord.description || undefined,
    expiryDate: dataverseRecord.kf_expirydate || dataverseRecord.expiryDate || null,
    tags: dataverseRecord.kf_tags
      ? (typeof dataverseRecord.kf_tags === 'string' 
          ? dataverseRecord.kf_tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : dataverseRecord.kf_tags)
      : [],
    // Confidential field doesn't exist - default to false
    isConfidential: false,
    // Status: Use calculated status from expiry date, or kf_documentstatus if available
    status: calculateDocumentStatus(dataverseRecord.kf_expirydate || dataverseRecord.expiryDate),
    // Organisation: Use account value or business unit value
    organisation: dataverseRecord._kf_account_value || dataverseRecord._owningbusinessunit_value || dataverseRecord.organisation || '',
    // Latest version: Use fileversionnumber or versionnumber
    latestVersion: dataverseRecord.kf_fileversionnumber || dataverseRecord.kf_versionnumber || 1,
    fileUrl: dataverseRecord.kf_fileurl || dataverseRecord.fileUrl,
    uploadDate: dataverseRecord.kf_uploaddate || dataverseRecord.createdon || dataverseRecord.uploadDate,
    uploadedBy: dataverseRecord._createdby_value || dataverseRecord.uploadedBy,
  };
}

/**
 * Map Dataverse document version entity to DTO
 */
export function mapDocumentVersionToDTO(dataverseRecord: any): DocumentVersionDTO {
  return {
    id: dataverseRecord.kf_documentversionid || dataverseRecord.dq_documentversionid || dataverseRecord.id,
    documentId: dataverseRecord.kf_document || dataverseRecord.dq_document || dataverseRecord.documentId || '',
    versionNumber: dataverseRecord.kf_versionnumber || dataverseRecord.dq_versionnumber || dataverseRecord.versionNumber || 1,
    blobPath: dataverseRecord.kf_blobpath || dataverseRecord.dq_blobpath || dataverseRecord.blobPath || '',
    filename: dataverseRecord.kf_filename || dataverseRecord.dq_filename || dataverseRecord.filename || '',
    fileExtension: dataverseRecord.kf_fileextension || dataverseRecord.dq_fileextension || dataverseRecord.fileExtension,
    fileSize: (dataverseRecord.kf_filesize || dataverseRecord.dq_filesize) ? parseInt((dataverseRecord.kf_filesize || dataverseRecord.dq_filesize), 10) : dataverseRecord.fileSize,
    uploadedBy: dataverseRecord.kf_uploadedby || dataverseRecord.dq_uploadedby || dataverseRecord.uploadedBy,
    uploadedOn: dataverseRecord.kf_uploadedon || dataverseRecord.dq_uploadedon || dataverseRecord.uploadedOn,
  };
}

/**
 * Map DTO to Dataverse document entity format
 */
export function mapDTOToDataverseDocument(dto: Partial<DocumentDTO>): any {
  const record: any = {};
  
  // Map to actual field names
  if (dto.name !== undefined) record.kf_documentname = dto.name;
  if (dto.category !== undefined) record.kf_category = dto.category;
  if (dto.description !== undefined) record.kf_description = dto.description || '';
  if (dto.expiryDate !== undefined) record.kf_expirydate = dto.expiryDate;
  if (dto.tags !== undefined) record.kf_tags = Array.isArray(dto.tags) ? dto.tags.join(',') : dto.tags;
  // Confidential field doesn't exist - skip it
  // Organisation: Use _kf_account_value if provided as GUID, otherwise skip
  if (dto.organisation !== undefined && dto.organisation) {
    // If organisation is a GUID, set as account lookup
    if (dto.organisation.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      record._kf_account_value = dto.organisation;
    }
  }
  // Latest version: Use kf_fileversionnumber
  if (dto.latestVersion !== undefined) record.kf_fileversionnumber = dto.latestVersion;
  
  return record;
}

/**
 * Map DTO to Dataverse document version entity format
 */
export function mapDTOToDataverseDocumentVersion(dto: Partial<DocumentVersionDTO>): any {
  const record: any = {};
  
  if (dto.documentId !== undefined) record.kf_document = dto.documentId;
  if (dto.versionNumber !== undefined) record.kf_versionnumber = dto.versionNumber;
  if (dto.blobPath !== undefined) record.kf_blobpath = dto.blobPath;
  if (dto.filename !== undefined) record.kf_filename = dto.filename;
  if (dto.fileExtension !== undefined) record.kf_fileextension = dto.fileExtension;
  if (dto.fileSize !== undefined) record.kf_filesize = dto.fileSize?.toString();
  if (dto.uploadedBy !== undefined) record.kf_uploadedby = dto.uploadedBy;
  if (dto.uploadedOn !== undefined) record.kf_uploadedon = dto.uploadedOn;
  
  return record;
}

