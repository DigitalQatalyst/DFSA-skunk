import React from 'react';
import {
    FileTextIcon,
    ClockIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
} from 'lucide-react';
import { PillFilters } from '../PillFilters';
export function DocumentDashboard({ stats, onFilterByStatus, activeFilter }: { stats: { total: number; active: number; expiring: number; expired: number; }; onFilterByStatus: (status: string | null) => void; activeFilter: string | null; }) {
    return (
        <PillFilters
            options={[
                { value: 'total', label: 'Total' },
                { value: 'active', label: 'Active' },
                { value: 'expiring', label: 'Expiring' },
                { value: 'expired', label: 'Expired' },
            ]}
            currentValue={activeFilter}
            onFilterChange={onFilterByStatus}
        />
    );

}
