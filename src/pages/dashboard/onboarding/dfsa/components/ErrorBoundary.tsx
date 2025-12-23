/**
 * ErrorBoundary Component
 * Catches and handles React errors in the onboarding form
 *
 * Features:
 * - Error catching and display
 * - Retry functionality
 * - Error reporting
 * - Fallback UI
 *
 * DFSA Compliance:
 * - Preserves audit logging for errors
 * - Formal error messaging
 * - No outcome predictions
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '../../../../../components/Button/Button'
import { auditLog as auditLogger } from '../../../../../utils/auditLogger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary component for DFSA onboarding form
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * @example
 * ```typescript
 * <ErrorBoundary>
 *   <SteppedForm />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to audit logger
    auditLogger.log('DFSA_ONBOARDING_ERROR', {
      error: error.toString(),
      errorInfo: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    // Log to console for development
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    })
  }

  handleRetry = () => {
    // Clear error state and retry
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    auditLogger.log('DFSA_ONBOARDING_ERROR_RETRY', {
      timestamp: new Date().toISOString(),
    })
  }

  handleReload = () => {
    // Reload the page
    auditLogger.log('DFSA_ONBOARDING_ERROR_RELOAD', {
      timestamp: new Date().toISOString(),
    })

    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg w-full text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>

            {/* Error Heading */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              An Error Occurred
            </h2>

            {/* Error Description */}
            <p className="text-gray-600 text-sm mb-6">
              The application encountered an unexpected error. Your progress has been saved, and you
              can retry or reload the page.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 text-left">
                <p className="text-xs font-mono text-gray-700 mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs font-mono text-gray-600">
                    <summary className="cursor-pointer mb-2">Stack Trace</summary>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                icon={<RefreshCw size={16} />}
                iconPosition="left"
              >
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </div>

            {/* Support Information */}
            <p className="text-xs text-gray-500 mt-6">
              If this problem persists, please contact support with the application reference number.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
