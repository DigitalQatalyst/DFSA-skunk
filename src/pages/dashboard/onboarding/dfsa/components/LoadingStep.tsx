/**
 * LoadingStep Component
 * Displays loading state while draft data is being fetched
 *
 * Features:
 * - Skeleton loader for better perceived performance
 * - Accessible loading message
 * - Consistent styling with form theme
 *
 * DFSA Compliance:
 * - Neutral loading message
 * - Accessible for screen readers
 */

import React from 'react'

/**
 * Loading step component for draft data loading
 *
 * Displays a skeleton loader and loading message while the application
 * is fetching draft data from the server.
 *
 * @example
 * ```typescript
 * {isLoadingDraft ? (
 *   <LoadingStep />
 * ) : (
 *   renderStepContent()
 * )}
 * ```
 */
export const LoadingStep: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]" role="status" aria-live="polite">
      {/* Animated spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-[#9B1823] border-t-transparent animate-spin" />
      </div>

      {/* Loading message */}
      <p className="text-base font-medium text-gray-700 mb-2">Loading your application...</p>
      <p className="text-sm text-gray-500">This will only take a moment</p>

      {/* Skeleton content (optional) */}
      <div className="mt-12 w-full max-w-2xl space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Screen reader message */}
      <span className="sr-only">Loading application data, please wait</span>
    </div>
  )
}
