/**
 * DFSA Form Components
 *
 * Reusable form components with DFSA validation and styling
 * Requirements: 6.1, 6.2
 */

export { FormInput, type FormInputProps } from './FormInput';
export { FormSelect, type FormSelectProps, type SelectOption } from './FormSelect';
export { FormCheckbox, type FormCheckboxProps } from './FormCheckbox';
export { FormTextArea, type FormTextAreaProps } from './FormTextArea';

// Form Wizard Components
export { FinancialServicesFormV2, type FormWizardProps } from './FinancialServicesFormV2';
export { FORM_STEPS, STAGE_NAMES, getStepById, getStepsByStage, evaluateStepVisibility } from './stepDefinitions';
export * from './formWizardState';
export * from './formValidation';

// Draft Management - Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
export * from './draftManager';
export { useDraftManager, type UseDraftManagerState, type UseDraftManagerActions, type UseDraftManagerOptions, type UseDraftManagerReturn } from './useDraftManager';
export { SaveStatusIndicator, SaveStatusBadge, type SaveStatusIndicatorProps, type SaveStatusBadgeProps } from './SaveStatusIndicator';

// Rules Engine - export specific items to avoid conflicts
export {
  RulesEngine,
  rulesEngine,
  getVisibleSteps,
  getFieldVisibility,
  isFieldVisible,
  evaluateCondition,
  evaluateConditionGroup,
  getValueByPath,
  hasMatrixActivity,
  isRepresentativeOfficeOnly,
  type RuleOperator,
  type GroupOperator,
  type RuleCondition,
  type Rule,
  type VisibilityResult,
  type FieldVisibilityMap
} from './rulesEngine';

// Step Components - Stage 1
export { Step1_1_IntroductionDisclosure } from './steps/Step1_1_IntroductionDisclosure';
export { Step1_2_StandingData } from './steps/Step1_2_StandingData';
export { Step1_3_OwnershipInformation } from './steps/Step1_3_OwnershipInformation';
export { Step1_4_ControllersGroupStructure } from './steps/Step1_4_ControllersGroupStructure';
export { Step1_5_PermissionsFinancialServices } from './steps/Step1_5_PermissionsFinancialServices';

// Step Components - Stage 2 (Activity-Specific)
export { Step2_1_FundManagement } from './steps/Step2_1_FundManagement';
export { Step2_2_RepresentativeOffice } from './steps/Step2_2_RepresentativeOffice';
export { Step2_3_IslamicEndorsement } from './steps/Step2_3_IslamicEndorsement';
export { Step2_4_AdvisingArranging } from './steps/Step2_4_AdvisingArranging';
export { Step2_5_InsuranceIntermediation } from './steps/Step2_5_InsuranceIntermediation';
export { Step2_6_AssetManagement } from './steps/Step2_6_AssetManagement';
export { Step2_7_SalesTrading } from './steps/Step2_7_SalesTrading';
export { Step2_10_MoneyServices } from './steps/Step2_10_MoneyServices';
export { Step2_11_DirectInsurance } from './steps/Step2_11_DirectInsurance';
export { Step2_12_Banking } from './steps/Step2_12_Banking';
export { Step2_13_RetailEndorsement } from './steps/Step2_13_RetailEndorsement';
export { Step2_14_ClientAssets } from './steps/Step2_14_ClientAssets';
export { Step2_21_Crowdfunding } from './steps/Step2_21_Crowdfunding';

// Step Components - Stage 3 (Core Profile)
export { Step3_1_BusinessPlan } from './steps/Step3_1_BusinessPlan';
export { Step3_2_Clients } from './steps/Step3_2_Clients';
export { Step3_4_RiskManagementCompliance } from './steps/Step3_4_RiskManagementCompliance';
export { Step3_5_Governance } from './steps/Step3_5_Governance';

// Step Components - Stage 4 (Final Submission)
export { Step4_1_WaiversModifications } from './steps/Step4_1_WaiversModifications';
export { Step4_2_ApplicationFees } from './steps/Step4_2_ApplicationFees';
export { Step4_3_FitProperDeclarations } from './steps/Step4_3_FitProperDeclarations';
export { Step4_4_ReviewSubmit } from './steps/Step4_4_ReviewSubmit';

// PDF Export - Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
export {
  DFSAPDFGenerator,
  generateApplicationPDF,
  generateApplicationPDFBlob,
  generateApplicationPDFBase64,
  type PDFGeneratorOptions,
  type DocumentInfo
} from './pdfExport';

// Document Upload - Requirements: 4.1, 4.2, 4.4, 4.5
export {
  // Storage utilities
  DOCUMENTS_STORAGE_KEY,
  ALLOWED_FILE_TYPES,
  FILE_EXTENSION_MAP,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  validateFile,
  fileToBase64,
  base64ToBlob,
  formatFileSize,
  getFileExtension,
  generateDocumentId,
  getDocumentsFromStorage,
  getDocumentsByStep,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  clearAllDocuments,
  createDocumentDownloadUrl,
  downloadDocument,
  getDocumentCount,
  getTotalDocumentSize,
  type StoredDocument,
  type DocumentValidationResult,
  type DocumentUploadResult
} from './documentStorage';

export { DocumentUpload, type DocumentUploadProps } from './DocumentUpload';
export { DocumentList, type DocumentListProps } from './DocumentList';
export { DocumentUploadField, type DocumentUploadFieldProps } from './DocumentUploadField';
export {
  useDocuments,
  type UseDocumentsOptions,
  type UseDocumentsState,
  type UseDocumentsActions,
  type UseDocumentsReturn
} from './useDocuments';

// Error Handling and User Feedback - Requirements: 6.2, 6.3
export {
  ERROR_MESSAGES,
  createFormError,
  formatValidationErrors,
  getNetworkErrorMessage,
  getFileUploadErrorMessage,
  formatErrorCount,
  getFirstErrorFieldId,
  focusFirstError,
  groupErrorsByStep,
  type ErrorCode,
  type ErrorSeverity,
  type FormError
} from './errorMessages';

export {
  LoadingSpinner,
  LoadingOverlay,
  InlineLoading,
  SaveProgressIndicator,
  StepProgress,
  FormSkeleton,
  RetryButton,
  StatusBanner,
  type LoadingSpinnerProps,
  type LoadingOverlayProps,
  type InlineLoadingProps,
  type SaveProgressState,
  type SaveProgressIndicatorProps,
  type StepProgressProps,
  type FormSkeletonProps,
  type RetryButtonProps,
  type OperationStatus,
  type StatusBannerProps
} from './LoadingStates';

export {
  ValidationErrorSummary,
  InlineError,
  StepValidationStatus,
  FormValidationSummary,
  type ValidationErrorSummaryProps,
  type InlineErrorProps,
  type StepValidationStatusProps,
  type FormValidationSummaryProps
} from './ValidationErrorSummary';

export {
  FormErrorBoundary,
  StepErrorBoundary,
  useFormErrorHandler,
  type FormErrorBoundaryProps
} from './FormErrorBoundary';

export {
  getOnlineStatus,
  isOnline,
  isOffline,
  subscribeToOnlineStatus,
  saveWithOfflineFallback,
  loadWithOfflineFallback,
  getPendingOperations,
  addPendingOperation,
  removePendingOperation,
  updateOperationRetryCount,
  clearPendingOperations,
  processPendingOperations,
  useOnlineStatus,
  useOfflineSupport,
  type OnlineStatus,
  type PendingOperation
} from './offlineSupport';
