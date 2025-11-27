import React from 'react';
import { ServiceRequestStatus } from '../../types';
interface StatusBadgeProps {
    status: ServiceRequestStatus;
}
export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusStyles = (status: ServiceRequestStatus) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'under-review':
                return 'bg-blue-100 text-blue-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusLabel = (status: ServiceRequestStatus) => {
        switch (status) {
            case 'draft':
                return 'Draft';
            case 'under-review':
                return 'Under Review';
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(status)}`}
        >
            {getStatusLabel(status)}
        </span>
    );
}
