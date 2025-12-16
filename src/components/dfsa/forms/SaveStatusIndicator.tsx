/**
 * DFSA Financial Services Application - Save Status Indicator Component
 *
 * Displays the current save status with visual feedback including
 * saving animation, success confirmation, and error states.
 *
 * Requirement 2.5: Display saving status and last saved timestamp
 */

import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Cloud, CloudOff } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { SaveStatus } from './draftManager';

export interface SaveStatusIndicatorProps {
  /** Current save status */
  status: SaveStatus;
  /** Formatted last saved timestamp string */
  lastSavedFormatted: string;
  /** Whether auto-save is active */
  isAutoSaveActive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show compact version */
  compact?: boolean;
}

/**
 * Save Status Indicator Component
 *
 * Displays visual feedback for save operations including:
 * - Idle state (no recent save activity)
 * - Saving state (animated spinner)
 * - Saved state (success checkmark with timestamp)
 * - Error state (error icon with message)
 */
export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  lastSavedFormatted,
  isAutoSaveActive = true,
  className,
  compact = false
}) => {
  const renderStatusContent = () => {
    switch (status) {
      case 'saving':
        return (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            {!compact && (
              <span className="text-sm text-gray-600">Saving...</span>
            )}
          </div>
        );

      case 'saved':
        return (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">
              {compact ? 'Saved' : lastSavedFormatted}
            </span>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">
              {compact ? 'Error' : 'Save failed - will retry'}
            </span>
          </div>
        );

      case 'idle':
      default:
        return (
          <div className="flex items-center space-x-2">
            {isAutoSaveActive ? (
              <Cloud className="w-4 h-4 text-gray-400" />
            ) : (
              <CloudOff className="w-4 h-4 text-gray-400" />
            )}
            {!compact && (
              <span className="text-sm text-gray-500">
                {lastSavedFormatted !== 'Not saved yet'
                  ? lastSavedFormatted
                  : isAutoSaveActive
                  ? 'Auto-save enabled'
                  : 'Auto-save disabled'}
              </span>
            )}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'flex items-center transition-all duration-200',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={`Save status: ${status}`}
    >
      {renderStatusContent()}
    </div>
  );
};

/**
 * Inline Save Status Badge
 *
 * A more compact badge-style indicator for use in headers or toolbars
 */
export interface SaveStatusBadgeProps {
  status: SaveStatus;
  lastSavedFormatted: string;
  className?: string;
}

export const SaveStatusBadge: React.FC<SaveStatusBadgeProps> = ({
  status,
  lastSavedFormatted,
  className
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'saving':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'saved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="w-3 h-3 animate-spin" />;
      case 'saved':
        return <CheckCircle className="w-3 h-3" />;
      case 'error':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Cloud className="w-3 h-3" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSavedFormatted;
      case 'error':
        return 'Save failed';
      default:
        return lastSavedFormatted !== 'Not saved yet' ? lastSavedFormatted : 'Draft';
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        getStatusStyles(),
        className
      )}
      role="status"
      aria-live="polite"
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default SaveStatusIndicator;
