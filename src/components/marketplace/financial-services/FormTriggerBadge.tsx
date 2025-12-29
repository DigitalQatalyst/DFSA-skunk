import React from 'react';
import { FileText } from 'lucide-react';

export interface FormTriggerBadgeProps {
    triggersForm?: string;
    formCode?: string;
    size?: 'sm' | 'md';
}

/**
 * FormTriggerBadge Component
 * Displays form trigger information for an activity
 */
export const FormTriggerBadge: React.FC<FormTriggerBadgeProps> = ({
    triggersForm,
    formCode,
    size = 'md',
}) => {
    if (!triggersForm && !formCode) {
        return null;
    }

    const displayText = triggersForm || `Form ${formCode}`;

    const sizeClasses = size === 'sm'
        ? 'px-2 py-1 text-xs'
        : 'px-3 py-1.5 text-xs';

    return (
        <div
            className={`
        inline-flex items-center gap-1.5 rounded-md font-medium
        bg-gray-50 text-gray-600 border border-gray-200
        ${sizeClasses}
      `}
            title={`This activity triggers ${displayText}`}
        >
            <FileText size={14} className="flex-shrink-0" />
            <span className="whitespace-nowrap">{displayText}</span>
        </div>
    );
};
