/**
 * DFSA Regimes
 * Top-level authorization categories
 */

import { Regime } from '../types';

export const regimes: Regime[] = [
    {
        id: 'regime-1',
        code: 'REGIME_1',
        name: 'Authorisation',
        fullName: 'REGIME 1: AUTHORISED FIRM',
        description: 'Entities conducting Financial Services or Ancillary Services within DIFC',
        pathways: [], // Populated from pathways.ts
    },
    {
        id: 'regime-2',
        code: 'REGIME_2',
        name: 'Recognition',
        fullName: 'REGIME 2: AUTHORISED MARKET INSTITUTION (AMI)',
        description: 'Entities operating financial market infrastructure',
        pathways: [],
    },
    {
        id: 'regime-3',
        code: 'REGIME_3',
        name: 'Registration',
        fullName: 'REGIME 3: REPRESENTATIVE OFFICE',
        description: 'Entities conducting marketing activities only (no Financial Services)',
        pathways: [],
    },
];

/**
 * Get regime by ID
 */
export const getRegimeById = (id: string): Regime | undefined => {
    return regimes.find(regime => regime.id === id);
};

/**
 * Get regime by code
 */
export const getRegimeByCode = (code: string): Regime | undefined => {
    return regimes.find(regime => regime.code === code);
};
