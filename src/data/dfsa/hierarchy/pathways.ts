/**
 * DFSA Pathways
 * Authorization pathways organized by regime
 */

import { Pathway } from '../types';

/**
 * Regime 1: Authorised Firm Pathways
 */
export const regime1Pathways: Pathway[] = [
    {
        id: 'pathway-1',
        selectionCode: 'Selection_1.A1',
        name: 'Banking, Investment, Insurance Intermediation Business',
        description: 'Core financial services including banking, investment, and insurance intermediation activities',
        regimeId: 'regime-1',
        activities: [], // Populated from activities files
    },
    {
        id: 'pathway-2',
        selectionCode: 'Selection_1.A2',
        name: 'Insurance (General) Business',
        description: 'General insurance underwriting and risk management',
        regimeId: 'regime-1',
        activities: [],
    },
    {
        id: 'pathway-3',
        selectionCode: 'Selection_1.A3',
        name: 'Insurance (Life) Business',
        description: 'Life insurance and long-term insurance contracts',
        regimeId: 'regime-1',
        activities: [],
    },
    {
        id: 'pathway-5',
        selectionCode: 'Selection_1.A5',
        name: 'Money Services Business',
        description: 'Payment services, money transmission, and stored value activities',
        regimeId: 'regime-1',
        activities: [],
    },
    {
        id: 'pathway-6',
        selectionCode: 'Selection_1.A6',
        name: 'Operating a Credit Rating Agency',
        description: 'Issuing credit ratings and related analytical services',
        regimeId: 'regime-1',
        activities: [],
    },
    {
        id: 'pathway-8',
        selectionCode: 'Selection_1.A8',
        name: 'Protected Cell Company (Insurance)',
        description: 'Insurance business through protected cell structures',
        regimeId: 'regime-1',
        activities: [],
    },
];

/**
 * Regime 2: Authorised Market Institution Pathways
 */
export const regime2Pathways: Pathway[] = [
    {
        id: 'pathway-4',
        selectionCode: 'Selection_1.A4',
        name: 'Employee Money Purchase Scheme / Market Operator',
        description: 'Operating employee pension schemes or market infrastructure',
        regimeId: 'regime-2',
        activities: [],
    },
    {
        id: 'pathway-7',
        selectionCode: 'Selection_1.A7',
        name: 'Operating an Alternative Trading System',
        description: 'Operating alternative trading platforms for securities',
        regimeId: 'regime-2',
        activities: [],
    },
];

/**
 * Regime 3: Representative Office Pathways
 */
export const regime3Pathways: Pathway[] = [
    {
        id: 'pathway-9',
        selectionCode: 'Rep_Office_Selection.A1',
        name: 'Representative Office',
        description: 'Marketing and promotional activities only (no financial services)',
        regimeId: 'regime-3',
        activities: [],
    },
];

/**
 * All pathways combined
 */
export const allPathways: Pathway[] = [
    ...regime1Pathways,
    ...regime2Pathways,
    ...regime3Pathways,
];

/**
 * Get pathway by ID
 */
export const getPathwayById = (id: string): Pathway | undefined => {
    return allPathways.find(pathway => pathway.id === id);
};

/**
 * Get pathways by regime ID
 */
export const getPathwaysByRegimeId = (regimeId: string): Pathway[] => {
    return allPathways.filter(pathway => pathway.regimeId === regimeId);
};
