/**
 * DFSA Hierarchy Data - Index
 * Aggregates all regimes, pathways, and activities into a complete hierarchy
 */

import { Regime, Pathway } from '../types';
import { regimes as baseRegimes } from './regimes';
import { allPathways as basePathways } from './pathways';

// Import all pathway activities
import { pathway1Activities } from './activities/pathway1-bii';
import { pathway2Activities } from './activities/pathway2-general-insurance';
import { pathway3Activities } from './activities/pathway3-life-insurance';
import { pathway4Activities } from './activities/pathway4-emp-market';
import { pathway5Activities } from './activities/pathway5-money-services';
import { pathway6Activities } from './activities/pathway6-credit-rating';
import { pathway7Activities } from './activities/pathway7-ats';
import { pathway8Activities } from './activities/pathway8-pcc';
import { pathway9Activities } from './activities/pathway9-rep-office';

/**
 * Map pathway IDs to their activities
 */
const pathwayActivitiesMap: Record<string, any[]> = {
    'pathway-1': pathway1Activities,
    'pathway-2': pathway2Activities,
    'pathway-3': pathway3Activities,
    'pathway-4': pathway4Activities,
    'pathway-5': pathway5Activities,
    'pathway-6': pathway6Activities,
    'pathway-7': pathway7Activities,
    'pathway-8': pathway8Activities,
    'pathway-9': pathway9Activities,
};

/**
 * Populate pathways with their activities
 */
const populatedPathways: Pathway[] = basePathways.map(pathway => ({
    ...pathway,
    activities: pathwayActivitiesMap[pathway.id] || [],
}));

/**
 * Populate regimes with their pathways (including activities)
 */
export const regimes: Regime[] = baseRegimes.map(regime => ({
    ...regime,
    pathways: populatedPathways.filter(p => p.regimeId === regime.id),
}));

/**
 * All pathways with activities populated
 */
export const allPathways: Pathway[] = populatedPathways;

/**
 * Helper functions
 */

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

/**
 * Get all activities across all pathways
 */
export const getAllActivities = () => {
    return allPathways.flatMap(pathway => pathway.activities);
};

/**
 * Search activities by query
 */
export const searchActivities = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return getAllActivities().filter(activity =>
        activity.name.toLowerCase().includes(lowerQuery) ||
        activity.code.toLowerCase().includes(lowerQuery) ||
        activity.description?.toLowerCase().includes(lowerQuery) ||
        activity.products.some(p => p.name.toLowerCase().includes(lowerQuery))
    );
};

// Export endorsements
export { endorsements } from './endorsements';
