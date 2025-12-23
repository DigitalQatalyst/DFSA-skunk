import React from 'react';
import { Pathway } from '../../../data/dfsa/types';
import { PathwayCard } from './PathwayCard';

export interface PathwayGridProps {
    pathways: Pathway[];
    onSelectPathway: (pathwayId: string) => void;
    accentColor?: 'primary' | 'gold' | 'teal' | 'gray';
}

/**
 * PathwayGrid Component
 * Grid layout for pathway selection cards
 */
export const PathwayGrid: React.FC<PathwayGridProps> = ({
    pathways,
    onSelectPathway,
    accentColor = 'primary',
}) => {
    if (!pathways || pathways.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No pathways available.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Pathway
                </h2>
                <p className="text-gray-600">
                    Choose the regulatory pathway that aligns with your business activities.
                    You can only select activities from one pathway.
                </p>
            </div>

            {/* Pathway Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pathways.map((pathway) => (
                    <PathwayCard
                        key={pathway.id}
                        pathway={pathway}
                        onSelect={onSelectPathway}
                        accentColor={accentColor}
                    />
                ))}
            </div>
        </div>
    );
};
