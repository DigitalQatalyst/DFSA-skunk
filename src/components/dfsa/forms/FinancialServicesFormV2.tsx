/**
 * DFSA Financial Services Application Form V2
 *
 * Main form wizard container with navigation, progress tracking, and state management
 * Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 6.2, 6.3
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { cn } from '../../../lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle,
  Circle,
  FileText,
  Loader2,
  RotateCcw,
  CloudOff,
  AlertCircle
} from 'lucide-react';

// Import step components - Stage 1
import { Step1_1_IntroductionDisclosure } from './steps/Step1_1_IntroductionDisclosure';
import { Step1_2_StandingData } from './steps/Step1_2_StandingData';
import { Step1_3_OwnershipInformation } from './steps/Step1_3_OwnershipInformation';
import { Step1_4_ControllersGroupStructure } from './steps/Step1_4_ControllersGroupStructure';
import { Step1_5_PermissionsFinancialServices } from './steps/Step1_5_PermissionsFinancialServices';

// Import step components - Stage 2 (Activity-Specific)
import { Step2_1_FundManagement } from './steps/Step2_1_FundManagement';
import { Step2_2_RepresentativeOffice } from './steps/Step2_2_RepresentativeOffice';
import { Step2_3_IslamicEndorsement } from './steps/Step2_3_IslamicEndorsement';
import { Step2_4_AdvisingArranging } from './steps/Step2_4_AdvisingArranging';
import { Step2_5_InsuranceIntermediation } from './steps/Step2_5_InsuranceIntermediation';
import { Step2_6_AssetManagement } from './steps/Step2_6_AssetManagement';
import { Step2_7_SalesTrading } from './steps/Step2_7_SalesTrading';
import { Step2_10_MoneyServices } from './steps/Step2_10_MoneyServices';
import { Step2_11_DirectInsurance } from './steps/Step2_11_DirectInsurance';
import { Step2_12_Banking } from './steps/Step2_12_Banking';
import { Step2_13_RetailEndorsement } from './steps/Step2_13_RetailEndorsement';
import { Step2_14_ClientAssets } from './steps/Step2_14_ClientAssets';
import { Step2_21_Crowdfunding } from './steps/Step2_21_Crowdfunding';

// Import step components - Stage 3 (Core Profile)
import { Step3_1_BusinessPlan } from './steps/Step3_1_BusinessPlan';
import { Step3_2_Clients } from './steps/Step3_2_Clients';
import { Step3_4_RiskManagementCompliance } from './steps/Step3_4_RiskManagementCompliance';
import { Step3_5_Governance } from './steps/Step3_5_Governance';

// Import step components - Stage 4 (Final Submission)
import { Step4_1_WaiversModifications } from './steps/Step4_1_WaiversModifications';
import { Step4_2_ApplicationFees } from './steps/Step4_2_ApplicationFees';
import { Step4_3_FitProperDeclarations } from './steps/Step4_3_FitProperDeclarations';
import { Step4_4_ReviewSubmit } from './steps/Step4_4_ReviewSubmit';

import { FSApplicationFormData } from '../../../types/dfsa';
import { STAGE_NAMES, getStepById } from './stepDefinitions';
import {
  FormWizardState,
  createInitialWizardState,
  updateApplicableSteps,
  canNavigateToStep,
  getNextStepIndex,
  getPreviousStepIndex
} from './formWizardState';
import { validateStep } from './formValidation';
import { useDraftManager } from './useDraftManager';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { clearDraftFromLocalStorage, DraftData } from './draftManager';
import { FormErrorBoundary, StepErrorBoundary } from './FormErrorBoundary';
import { ValidationErrorSummary } from './ValidationErrorSummary';
import { LoadingOverlay, StatusBanner } from './LoadingStates';
import { useOnlineStatus, useOfflineSupport } from './offlineSupport';
import { focusFirstError } from './errorMessages';

export interface FormWizardProps {
  applicationId?: string;
  mode?: 'create' | 'edit' | 'view';
  onSave?: (formData: FSApplicationFormData, currentStep: string, completedSteps: string[]) => Promise<void>;
  onSubmit?: (formData: FSApplicationFormData) => Promise<void>;
}

export const FinancialServicesFormV2: React.FC<FormWizardProps> = ({
  applicationId,
  mode = 'create',
  onSave,
  onSubmit
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDraftRestorePrompt, setShowDraftRestorePrompt] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [operationStatus, setOperationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [operationMessage, setOperationMessage] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Online status for offline support - Requirements: 6.2, 6.3
  const onlineStatus = useOnlineStatus();
  const { isOffline, pendingCount } = useOfflineSupport();

  // Main wizard state
  const [state, setState] = useState<FormWizardState>(createInitialWizardState);

  // Get current step ID for draft manager
  const currentStepId = state.applicableSteps[state.currentStepIndex] || 'step-1-1';

  // Draft management hook - Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
  const {
    saveStatus,
    lastSaved,
    lastSavedFormatted,
    hasDraft,
    progressPercent,
    isAutoSaveActive,
    saveDraft,
    loadDraft,
    clearDraft,
    startAutoSave,
    stopAutoSave
  } = useDraftManager(
    state.formData,
    currentStepId,
    state.currentStepIndex,
    state.completedSteps,
    state.applicableSteps,
    state.applicationId,
    state.applicationRef,
    {
      autoStart: true,
      onSaveComplete: (result) => {
        if (result.success) {
          setState(prev => ({
            ...prev,
            lastSaved: result.timestamp
          }));
        }
      },
      onDraftLoaded: (data: DraftData) => {
        // Update state with loaded draft data
        setState(prev => ({
          ...prev,
          formData: data.formData,
          currentStepIndex: data.metadata.currentStepIndex,
          completedSteps: data.metadata.completedSteps,
          applicationId: data.metadata.applicationId,
          applicationRef: data.metadata.applicationRef,
          lastSaved: new Date(data.metadata.lastSaved),
          applicableSteps: updateApplicableSteps(data.formData)
        }));
      }
    }
  );

  // Check for existing draft on mount and show restore prompt
  useEffect(() => {
    if (hasDraft && mode === 'create') {
      setShowDraftRestorePrompt(true);
    }
  }, [hasDraft, mode]);

  // Handle draft restoration
  const handleRestoreDraft = useCallback(() => {
    const draftData = loadDraft();
    if (draftData) {
      setState(prev => ({
        ...prev,
        formData: draftData.formData,
        currentStepIndex: draftData.metadata.currentStepIndex,
        completedSteps: draftData.metadata.completedSteps,
        applicationId: draftData.metadata.applicationId,
        applicationRef: draftData.metadata.applicationRef,
        lastSaved: new Date(draftData.metadata.lastSaved),
        applicableSteps: updateApplicableSteps(draftData.formData)
      }));
    }
    setShowDraftRestorePrompt(false);
  }, [loadDraft]);

  // Handle starting fresh (clear draft)
  const handleStartFresh = useCallback(() => {
    clearDraft();
    setState(createInitialWizardState());
    setShowDraftRestorePrompt(false);
  }, [clearDraft]);

  // Handle URL step parameter
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepIndex = state.applicableSteps.findIndex(stepId => stepId === stepParam);
      if (stepIndex !== -1 && canNavigateToStep(stepIndex, state.currentStepIndex, state.completedSteps, state.applicableSteps)) {
        setState(prev => ({ ...prev, currentStepIndex: stepIndex }));
      }
    }
  }, [searchParams, state.applicableSteps, state.currentStepIndex, state.completedSteps]);

  // Update form data and recalculate applicable steps
  const updateFormData = useCallback((updates: Partial<FSApplicationFormData>) => {
    setState(prev => {
      const newFormData = { ...prev.formData, ...updates };
      const newApplicableSteps = updateApplicableSteps(newFormData);

      return {
        ...prev,
        formData: newFormData,
        applicableSteps: newApplicableSteps,
        errors: {} // Clear errors when data changes
      };
    });
  }, []);

  // Navigation functions
  const navigateToStep = useCallback((stepIndex: number) => {
    if (canNavigateToStep(stepIndex, state.currentStepIndex, state.completedSteps, state.applicableSteps)) {
      setState(prev => ({ ...prev, currentStepIndex: stepIndex }));

      const stepId = state.applicableSteps[stepIndex];
      if (stepId) {
        setSearchParams({ step: stepId });
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.currentStepIndex, state.completedSteps, state.applicableSteps, setSearchParams]);

  const goToNextStep = useCallback(() => {
    // Prevent double navigation
    if (isNavigating) return;

    setIsNavigating(true);

    const currentStepId = state.applicableSteps[state.currentStepIndex];

    // Validate current step before proceeding - Requirements: 6.2, 6.3
    if (currentStepId) {
      const validation = validateStep(currentStepId, state.formData);
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          errors: validation.errors
        }));
        // Show validation error summary and focus first error
        setShowValidationErrors(true);
        focusFirstError(validation.errors);
        setIsNavigating(false);
        return;
      }

      // Clear errors if validation passes
      setState(prev => ({ ...prev, errors: {} }));
      setShowValidationErrors(false);
    }

    const nextIndex = getNextStepIndex(state.currentStepIndex, state.applicableSteps);
    if (nextIndex !== null) {
      // Update state with both completed step and new step index in one update
      setState(prev => {
        const newCompletedSteps = currentStepId && !prev.completedSteps.includes(currentStepId)
          ? [...prev.completedSteps, currentStepId]
          : prev.completedSteps;

        return {
          ...prev,
          currentStepIndex: nextIndex,
          completedSteps: newCompletedSteps
        };
      });

      // Update URL and scroll
      const nextStepId = state.applicableSteps[nextIndex];
      if (nextStepId) {
        setSearchParams({ step: nextStepId });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Reset navigation flag after a short delay to allow state updates
    setTimeout(() => setIsNavigating(false), 100);
  }, [state.currentStepIndex, state.applicableSteps, state.formData, setSearchParams, isNavigating]);

  const goToPreviousStep = useCallback(() => {
    const prevIndex = getPreviousStepIndex(state.currentStepIndex);
    if (prevIndex !== null) {
      navigateToStep(prevIndex);
    }
  }, [state.currentStepIndex, navigateToStep]);

  // Manual save function - Requirement 2.4
  const handleManualSave = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  // Submit function with error handling - Requirements: 6.2, 6.3
  const handleSubmit = useCallback(async () => {
    if (!onSubmit) return;

    setState(prev => ({ ...prev, isSubmitting: true }));
    setOperationStatus('loading');
    setOperationMessage('Submitting your application...');

    try {
      await onSubmit(state.formData);
      // Clear localStorage on successful submission
      clearDraftFromLocalStorage();
      setOperationStatus('success');
      setOperationMessage('Application submitted successfully!');
      // Navigate to success page or dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard/applications');
      }, 1500);
    } catch (error) {
      console.error('Submission failed:', error);
      setOperationStatus('error');
      setOperationMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit your application. Please try again.'
      );
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [onSubmit, state.formData, navigate]);

  // Current step information
  const currentStep = currentStepId ? getStepById(currentStepId) : null;
  const isLastStep = state.currentStepIndex === state.applicableSteps.length - 1;
  const canGoNext = getNextStepIndex(state.currentStepIndex, state.applicableSteps) !== null;
  const canGoPrevious = getPreviousStepIndex(state.currentStepIndex) !== null;

  // Group steps by stage for sidebar
  const stepsByStage = React.useMemo(() => {
    const grouped: Record<number, Array<{ stepId: string; step: any; index: number }>> = {};

    state.applicableSteps.forEach((stepId, index) => {
      const step = getStepById(stepId);
      if (step) {
        if (!grouped[step.stage]) {
          grouped[step.stage] = [];
        }
        grouped[step.stage].push({ stepId, step, index });
      }
    });

    return grouped;
  }, [state.applicableSteps]);

  // Render step content based on current step
  const renderStepContent = () => {
    const stepProps = {
      formData: state.formData,
      updateFormData,
      errors: state.errors,
      onNext: goToNextStep,
      onPrevious: goToPreviousStep,
      isReadOnly: mode === 'view'
    };

    switch (currentStepId) {
      // Stage 1 - General Requirements
      case 'step-1-1':
        return <Step1_1_IntroductionDisclosure {...stepProps} />;
      case 'step-1-2':
        return <Step1_2_StandingData {...stepProps} />;
      case 'step-1-3':
        return <Step1_3_OwnershipInformation {...stepProps} />;
      case 'step-1-4':
        return <Step1_4_ControllersGroupStructure {...stepProps} />;
      case 'step-1-5':
        return <Step1_5_PermissionsFinancialServices {...stepProps} />;

      // Stage 2 - Activity-Specific Steps
      case 'step-2-1':
        return <Step2_1_FundManagement {...stepProps} />;
      case 'step-2-2':
        return <Step2_2_RepresentativeOffice {...stepProps} />;
      case 'step-2-3':
        return <Step2_3_IslamicEndorsement {...stepProps} />;
      case 'step-2-4':
        return <Step2_4_AdvisingArranging {...stepProps} />;
      case 'step-2-5':
        return <Step2_5_InsuranceIntermediation {...stepProps} />;
      case 'step-2-6':
        return <Step2_6_AssetManagement {...stepProps} />;
      case 'step-2-7':
        return <Step2_7_SalesTrading {...stepProps} />;
      case 'step-2-10':
        return <Step2_10_MoneyServices {...stepProps} />;
      case 'step-2-11':
        return <Step2_11_DirectInsurance {...stepProps} />;
      case 'step-2-12':
        return <Step2_12_Banking {...stepProps} />;
      case 'step-2-13':
        return <Step2_13_RetailEndorsement {...stepProps} />;
      case 'step-2-14':
        return <Step2_14_ClientAssets {...stepProps} />;
      case 'step-2-21':
        return <Step2_21_Crowdfunding {...stepProps} />;

      // Stage 3 - Core Profile (Conditional - hidden for Representative Office only)
      case 'step-3-1':
        return <Step3_1_BusinessPlan {...stepProps} />;
      case 'step-3-2':
        return <Step3_2_Clients {...stepProps} />;
      case 'step-3-4':
        return <Step3_4_RiskManagementCompliance {...stepProps} />;
      case 'step-3-5':
        return <Step3_5_Governance {...stepProps} />;

      // Stage 4 - Final Submission (Always visible)
      case 'step-4-1':
        return <Step4_1_WaiversModifications {...stepProps} />;
      case 'step-4-2':
        return <Step4_2_ApplicationFees {...stepProps} />;
      case 'step-4-3':
        return <Step4_3_FitProperDeclarations {...stepProps} />;
      case 'step-4-4':
        return (
          <Step4_4_ReviewSubmit
            {...stepProps}
            applicationRef={state.applicationRef || 'DRAFT'}
            applicationStatus="draft"
          />
        );

      default:
        return (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Step Component: {currentStep?.component}
                </h3>
                <p className="text-gray-600">
                  This step component will be implemented in future tasks.
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  // Handle error boundary reset
  const handleErrorReset = useCallback(() => {
    setOperationStatus('idle');
    setOperationMessage('');
  }, []);

  // Handle navigation to home from error boundary
  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Dismiss validation errors
  const handleDismissValidationErrors = useCallback(() => {
    setShowValidationErrors(false);
  }, []);

  // Dismiss operation status
  const handleDismissStatus = useCallback(() => {
    setOperationStatus('idle');
    setOperationMessage('');
  }, []);

  return (
    <FormErrorBoundary
      formData={state.formData}
      currentStep={currentStepId}
      currentStepIndex={state.currentStepIndex}
      completedSteps={state.completedSteps}
      applicableSteps={state.applicableSteps}
      onReset={handleErrorReset}
      onNavigateHome={handleNavigateHome}
    >
      <div>
        {/* Loading Overlay for async operations */}
        <LoadingOverlay
          isVisible={state.isSubmitting}
          message="Submitting Application"
          subMessage="Please wait while we process your application..."
        />

        {/* Offline Banner - Requirements: 6.2, 6.3 */}
        {isOffline && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
              <CloudOff className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                You're currently offline. Your changes are being saved locally and will sync when you're back online.
                {pendingCount > 0 && ` (${pendingCount} pending operations)`}
              </p>
            </div>
          </div>
        )}

        {/* Operation Status Banner */}
        {operationStatus !== 'idle' && operationStatus !== 'loading' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <StatusBanner
              status={operationStatus}
              successMessage={operationMessage}
              errorMessage={operationMessage}
              onDismiss={handleDismissStatus}
            />
          </div>
        )}

        {/* Draft Restore Prompt - Requirement 2.2 */}
        {showDraftRestorePrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span>Resume Previous Application?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We found a saved draft of your application. Would you like to continue where you left off?
                </p>
                <p className="text-sm text-gray-500">
                  Last saved: {lastSavedFormatted}
                </p>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleRestoreDraft}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resume Draft
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleStartFresh}
                    className="flex-1"
                  >
                    Start Fresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-primary-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Financial Services Application
                  </h1>
                  {state.applicationRef && (
                    <p className="text-sm text-gray-500">
                      Reference: {state.applicationRef}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Save Status Indicator - Requirement 2.5 */}
                <SaveStatusIndicator
                  status={saveStatus}
                  lastSavedFormatted={lastSavedFormatted}
                  isAutoSaveActive={isAutoSaveActive}
                />

                {/* Manual Save Button - Requirement 2.4 */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualSave}
                  disabled={saveStatus === 'saving'}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Progress</CardTitle>
                  <div className="space-y-2">
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {state.completedSteps.length} of {state.applicableSteps.length} steps completed ({progressPercent}%)
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {Object.entries(stepsByStage).map(([stageNum, stageSteps]) => (
                    <div key={stageNum}>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Stage {stageNum}: {STAGE_NAMES[parseInt(stageNum) as keyof typeof STAGE_NAMES]}
                      </h3>

                      <div className="space-y-2">
                        {stageSteps.map(({ stepId, step, index }) => {
                          const isCompleted = state.completedSteps.includes(stepId);
                          const isCurrent = index === state.currentStepIndex;
                          const canAccess = canNavigateToStep(index, state.currentStepIndex, state.completedSteps, state.applicableSteps);

                          return (
                            <button
                              key={stepId}
                              onClick={() => navigateToStep(index)}
                              disabled={!canAccess}
                              className={cn(
                                'w-full text-left p-3 rounded-lg border transition-all duration-200',
                                'flex items-center space-x-3',
                                isCurrent && 'bg-primary-50 border-primary-600 text-primary-900',
                                isCompleted && !isCurrent && 'bg-dfsa-gold-50 border-dfsa-gold-600 text-dfsa-gold-800',
                                !isCompleted && !isCurrent && canAccess && 'hover:bg-gray-50 border-gray-200',
                                !canAccess && 'opacity-50 cursor-not-allowed border-gray-100'
                              )}
                            >
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-dfsa-gold-600" />
                                ) : isCurrent ? (
                                  <Circle className="w-5 h-5 text-primary-600 fill-current" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {step.name}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {currentStep?.name || 'Loading...'}
                      </CardTitle>
                      {currentStep && (
                        <p className="text-sm text-gray-600 mt-1">
                          Stage {currentStep.stage}: {STAGE_NAMES[currentStep.stage as keyof typeof STAGE_NAMES]}
                        </p>
                      )}
                    </div>

                    <Badge variant="outline">
                      Step {state.currentStepIndex + 1} of {state.applicableSteps.length}
                    </Badge>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="p-6">
                  {/* Validation Error Summary - Requirements: 6.2, 6.3 */}
                  {showValidationErrors && Object.keys(state.errors).length > 0 && (
                    <div className="mb-6">
                      <ValidationErrorSummary
                        errors={state.errors}
                        title="Please correct the following errors before continuing:"
                        onDismiss={handleDismissValidationErrors}
                        collapsible={true}
                        showFieldLinks={true}
                      />
                    </div>
                  )}

                  {/* Step Content with Error Boundary */}
                  <StepErrorBoundary
                    stepName={currentStep?.name || 'Current Step'}
                    onRetry={() => setState(prev => ({ ...prev }))}
                  >
                    {renderStepContent()}
                  </StepErrorBoundary>
                </CardContent>

                <Separator />

                {/* Navigation Footer */}
                <div className="p-6 bg-gray-50 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={!canGoPrevious}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    {/* Show error count if there are validation errors */}
                    {Object.keys(state.errors).length > 0 && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{Object.keys(state.errors).length} error(s)</span>
                      </div>
                    )}

                    {isLastStep ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={state.isSubmitting || progressPercent < 100}
                        className="bg-dfsa-gold-600 hover:bg-dfsa-gold-700 text-white"
                      >
                        {state.isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={goToNextStep}
                        disabled={!canGoNext || isNavigating}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </FormErrorBoundary>
  );
};
