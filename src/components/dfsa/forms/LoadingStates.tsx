/**
 * DFSA Form Loading States and Progress Indicators
 *
 * Loading states and progress indicators for async operations
 * Requirements: 6.2, 6.3
 */

import React from 'react';
import { Loader2, Save, CheckCircle, AlertCircle, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

/**
 * Loading spinner component
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center gap-2', className)} role="status" aria-live="polite">
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <span className="sr-only">{label || 'Loading...'}</span>
    </div>
  );
};

/**
 * Full page loading overlay
 */
export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  subMessage
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
    >
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p id="loading-message" className="text-lg font-medium text-gray-900">
          {message}
        </p>
        {subMessage && (
          <p className="text-sm text-gray-500 mt-2">{subMessage}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Inline loading state for buttons and actions
 */
export interface InlineLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  isLoading,
  loadingText = 'Loading...',
  children,
  className
}) => {
  if (isLoading) {
    return (
      <span className={cn('inline-flex items-center gap-2', className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>{loadingText}</span>
      </span>
    );
  }

  return <>{children}</>;
};

/**
 * Save progress indicator with different states
 */
export type SaveProgressState = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export interface SaveProgressIndicatorProps {
  state: SaveProgressState;
  lastSaved?: string;
  errorMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export const SaveProgressIndicator: React.FC<SaveProgressIndicatorProps> = ({
  state,
  lastSaved,
  errorMessage,
  onRetry,
  className
}) => {
  const renderContent = () => {
    switch (state) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Saving...</span>
          </div>
        );

      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">
              {lastSaved ? `Saved ${lastSaved}` : 'Saved'}
            </span>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage || 'Save failed'}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm underline hover:no-underline ml-1"
                aria-label="Retry saving"
              >
                Retry
              </button>
            )}
          </div>
        );

      case 'offline':
        return (
          <div className="flex items-center gap-2 text-amber-600">
            <CloudOff className="w-4 h-4" />
            <span className="text-sm">Offline - saved locally</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('transition-all duration-200', className)} role="status" aria-live="polite">
      {renderContent()}
    </div>
  );
};

/**
 * Step progress indicator
 */
export interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  className
}) => {
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-gray-600">
          {progressPercent}% complete
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Form progress: ${progressPercent}% complete`}
        />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for form fields
 */
export interface FormSkeletonProps {
  rows?: number;
  className?: string;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({
  rows = 3,
  className
}) => {
  return (
    <div className={cn('space-y-6 animate-pulse', className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
};

/**
 * Retry button with loading state
 */
export interface RetryButtonProps {
  onRetry: () => void;
  isRetrying?: boolean;
  label?: string;
  className?: string;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isRetrying = false,
  label = 'Try Again',
  className
}) => {
  return (
    <button
      onClick={onRetry}
      disabled={isRetrying}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium',
        'text-white bg-blue-600 rounded-md',
        'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {isRetrying ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Retrying...</span>
        </>
      ) : (
        <>
          <RefreshCw className="w-4 h-4" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

/**
 * Operation status banner
 */
export type OperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface StatusBannerProps {
  status: OperationStatus;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  onDismiss?: () => void;
  className?: string;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  loadingMessage = 'Processing...',
  successMessage = 'Operation completed successfully',
  errorMessage = 'An error occurred',
  onDismiss,
  className
}) => {
  if (status === 'idle') return null;

  const statusConfig = {
    loading: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: <Loader2 className="w-5 h-5 animate-spin text-blue-600" />,
      message: loadingMessage
    },
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      message: successMessage
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      message: errorMessage
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border',
        config.bg,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        {config.icon}
        <span className={cn('text-sm font-medium', config.text)}>
          {config.message}
        </span>
      </div>
      {onDismiss && status !== 'loading' && (
        <button
          onClick={onDismiss}
          className={cn('text-sm underline hover:no-underline', config.text)}
          aria-label="Dismiss message"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};
