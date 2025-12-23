/**
 * Pathway 6: Operating a Credit Rating Agency
 * Activities available under Selection_1.A6
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway6Activities: FinancialActivityHierarchy[] = [
    {
        id: 'cra-a1-issuing-ratings',
        code: 'CRA.A1',
        name: 'Issuing Credit Ratings',
        description: 'Issuing credit ratings and related analytical services',
        products: [
            { code: 'CRA.A1.C1', name: 'Corporate Credit Ratings' },
            { code: 'CRA.A1.C2', name: 'Sovereign Credit Ratings' },
            { code: 'CRA.A1.C3', name: 'Structured Finance Ratings' },
            { code: 'CRA.A1.C4', name: 'Financial Institution Ratings' },
        ],
        triggersForm: '2-18 Credit Rating Agency',
        formCode: '2-18',
        pathwayId: 'pathway-6',
        regimeId: 'regime-1',
    },
];
