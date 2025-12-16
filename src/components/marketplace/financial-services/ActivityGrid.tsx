import React from 'react';
import { FinancialActivityHierarchy } from '../../../data/dfsa/types';
import { ActivityCard } from './ActivityCard';

export interface ActivityGridProps {
    activities: FinancialActivityHierarchy[];
    onActivityAdd?: (activity: FinancialActivityHierarchy) => void;
    selectedActivityIds?: string[];
    regimeAccentColor?: 'primary' | 'gold' | 'teal' | 'gray';
}

/**
 * ActivityGrid Component
 * Responsive grid layout for displaying activity cards
 */
export const ActivityGrid: React.FC<ActivityGridProps> = ({
    activities,
    onActivityAdd,
    selectedActivityIds = [],
    regimeAccentColor = 'primary',
}) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No activities available for this pathway.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onAdd={onActivityAdd}
                    isSelected={selectedActivityIds.includes(activity.id)}
                    regimeAccentColor={regimeAccentColor}
                />
            ))}
        </div>
    );
};
