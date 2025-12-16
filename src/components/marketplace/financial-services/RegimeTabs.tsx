import React from 'react';
import { Regime } from '../../../data/dfsa/types';

export interface RegimeTabsProps {
    regimes: Regime[];
    activeRegimeId: string;
    onRegimeChange: (regimeId: string) => void;
}

/**
 * RegimeTabs Component
 * Tab navigation for selecting between different regimes
 */
export const RegimeTabs: React.FC<RegimeTabsProps> = ({
    regimes,
    activeRegimeId,
    onRegimeChange,
}) => {
    const getAccentColor = (regimeCode: string) => {
        switch (regimeCode) {
            case 'REGIME_1':
                return 'border-primary text-primary';
            case 'REGIME_2':
                return 'border-dfsa-gold-600 text-dfsa-gold-700';
            case 'REGIME_3':
                return 'border-dfsa-gray-600 text-dfsa-gray-700';
            default:
                return 'border-primary text-primary';
        }
    };

    return (
        <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Regimes">
                {regimes.map((regime) => {
                    const isActive = activeRegimeId === regime.id;
                    const accentColorClass = getAccentColor(regime.code);

                    return (
                        <button
                            key={regime.id}
                            onClick={() => onRegimeChange(regime.id)}
                            className={`
                px-6 py-3 text-sm font-medium border-b-2 transition-colors
                whitespace-nowrap
                ${isActive
                                    ? `${accentColorClass}`
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
              `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {regime.name}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
