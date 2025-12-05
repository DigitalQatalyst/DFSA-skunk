/**
 * SuccessModal Component
 * Displays application submission success confirmation
 *
 * Features:
 * - Visual confirmation with checkmark
 * - Application reference display
 * - Processing time information
 * - Return to dashboard action
 *
 * DFSA Compliance:
 * - Formal, neutral language
 * - No outcome predictions
 * - Factual processing information
 */

import React from 'react'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '../../../../../components/Button/Button'

interface SuccessModalProps {
  onClose: () => void
  applicationReference: string
}

/**
 * Success modal for completed application submission
 *
 * @param onClose - Callback when user closes modal
 * @param applicationReference - Unique application reference number
 *
 * @example
 * ```typescript
 * <SuccessModal
 *   onClose={() => navigate('/dashboard/profile')}
 *   applicationReference="APP-2025-12345"
 * />
 * ```
 */
export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, applicationReference }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-[90%] text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-white" />
        </div>

        {/* Heading */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Application Submitted Successfully!
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          Your DFSA licence application has been submitted and is now under review.
        </p>

        {/* Application Reference Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <p className="text-xs font-medium text-blue-800 mb-1">Application Reference</p>
          <p className="text-lg font-bold text-blue-900">{applicationReference}</p>
        </div>

        {/* Processing Information */}
        <p className="text-gray-500 text-xs mb-8">
          You will receive an email confirmation shortly. The DFSA will review your application and
          may request additional information. Typical processing time is 30-90 business days.
        </p>

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={onClose}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
