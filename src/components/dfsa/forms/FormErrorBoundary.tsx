/**
 * DFSA Form Error Boundary Component
 *
 * Error boundary specifically designed for the form wizard
 * with graceful error recovery and data preservation
 * Requirements: 6.2, 6.3
 */

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Save, Home, FileText } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { saveDraftToLocalStorage, loadDraftFromLocalStorage } from './draftManager';
import { FSApplicationFormData } from '../../../types/dfsa';

/**
 * Props for FormErrorBoundary
 */
export interface FormErrorBoundaryProps {
  children: ReactNode;
  formData?: FSApplicationFormData;
  currentStep?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  applicableSteps?: string[];
  onReset?: () => void;
  onNavigateHome?: () => void;
  fallback?: ReactNode;
}

/**
 * State for FormErrorBoundary
 */
interface FormErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  dataSaved: boolean;
  isRecovering: boolean;
}

/**
 * Form-specific Error Boundary
 *
 * Catches errors in the form wizard and attempts to preserve user data
 * by saving to localStorage before displaying the error UI.
 */
export class FormErrorBoundary extends Component<FormErrorBoundaryProps, FormErrorBoundaryState> {
  constructor(props: FormErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      dataSaved: false,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FormErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error for debugging
    console.error('[FormErrorBoundary] Caught error:', error);
    console.error('[FormErrorBoundary] Error info:', errorInfo);

    // Attempt to save form data to localStorage
    this.attemptDataSave();
  }

  /**
   * Attempts to save current form data to localStorage
   */
  private attemptDataSave(): void {
    const {
      formData,
      currentStep,
      currentStepIndex,
      completedSteps,
      applicableSteps
    } = this.props;

    if (formData && currentStep) {
      try {
        const result = saveDraftToLocalStorage(
          formData,
          currentStep,
          currentStepIndex || 0,
          completedSteps || [],
          applicableSteps || [],
          null,
          null
        );

        this.setState({ dataSaved: result.success });

        if (result.success) {
          console.log('[FormErrorBoundary] Form data saved to localStorage');
        }
      } catch (saveError) {
        console.error('[FormErrorBoundary] Failed to save form data:', saveError);
      }
    }
  }

  /**
   * Handles reset/retry action
   */
  private handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: true
    });

    // Call parent reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }

    // Reset recovering state after a short delay
    setTimeout(() => {
      this.setState({ isRecovering: false });
    }, 100);
  };

  /**
   * Handles navigation to home
   */
  private handleNavigateHome = (): void => {
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  /**
   * Handles page refresh
   */
  private handleRefresh = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, dataSaved, isRecovering } = this.state;
    const { children, fallback } = this.props;

    if (isRecovering) {
      return children;
    }

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Something went wrong
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-gray-600 text-center">
                We encountered an unexpected error while processing your application.
                {dataSaved && (
                  <span className="block mt-2 text-green-600 font-medium">
                    <Save className="w-4 h-4 inline mr-1" />
                    Your progress has been saved.
                  </span>
                )}
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                    <p className="font-medium text-red-600">{error.toString()}</p>
                    {error.stack && (
                      <pre className="mt-2 text-gray-600 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                    {errorInfo?.componentStack && (
                      <pre className="mt-2 text-gray-500 whitespace-pre-wrap">
                        Component Stack:{errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Recovery options */}
              <div className="space-y-3">
                <Button
                  onClick={this.handleReset}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={this.handleRefresh}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>

                <Button
                  onClick={this.handleNavigateHome}
                  className="w-full"
                  variant="ghost"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Dashboard
                </Button>
              </div>

              {/* Help text */}
              <p className="text-xs text-gray-500 text-center">
                If this problem persists, please contact support with error reference:{' '}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  {Date.now().toString(36).toUpperCase()}
                </code>
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

/**
 * Step-level error boundary for individual form steps
 */
export interface StepErrorBoundaryProps {
  children: ReactNode;
  stepName: string;
  onRetry?: () => void;
}

interface StepErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class StepErrorBoundary extends Component<StepErrorBoundaryProps, StepErrorBoundaryState> {
  constructor(props: StepErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): StepErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`[StepErrorBoundary] Error in step "${this.props.stepName}":`, error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, stepName } = this.props;

    if (hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800">
                Unable to load {stepName}
              </h3>
              <p className="mt-1 text-sm text-red-600">
                An error occurred while loading this step. Please try again.
              </p>
              {process.env.NODE_ENV === 'development' && error && (
                <p className="mt-2 text-xs text-red-500 font-mono">
                  {error.message}
                </p>
              )}
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook for programmatic error handling in form components
 */
export function useFormErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((err: Error | unknown) => {
    const error = err instanceof Error ? err : new Error(String(err));
    setError(error);
    console.error('[useFormErrorHandler] Error:', error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = React.useCallback(
    <T,>(fn: () => Promise<T>): Promise<T | null> => {
      return fn().catch((err) => {
        handleError(err);
        return null;
      });
    },
    [handleError]
  );

  return {
    error,
    hasError: error !== null,
    handleError,
    clearError,
    withErrorHandling
  };
}
