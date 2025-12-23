/**
 * Pathway 3: Insurance (Life) Business
 * Activities available under Selection_1.A3
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway3Activities: FinancialActivityHierarchy[] = [
    {
        id: 'li-a1-effecting-contracts',
        code: 'LI.A1',
        name: 'Effecting Contracts of Long Term Insurance',
        description: 'Underwriting life and long-term insurance contracts',
        products: [
            { code: 'LI.A1.C1', name: 'Life Insurance' },
            { code: 'LI.A1.C2', name: 'Annuities' },
            { code: 'LI.A1.C3', name: 'Pension Products' },
            { code: 'LI.A1.C4', name: 'Investment-Linked Insurance' },
        ],
        triggersForm: '2-17 Insurance Business',
        formCode: '2-17',
        pathwayId: 'pathway-3',
        regimeId: 'regime-1',
    },
    {
        id: 'li-a2-carrying-out-contracts',
        code: 'LI.A2',
        name: 'Carrying Out Contracts of Long Term Insurance',
        description: 'Managing and administering long-term insurance contracts',
        products: [
            { code: 'LI.A2.C1', name: 'Policy Management' },
            { code: 'LI.A2.C2', name: 'Claims Processing' },
        ],
        triggersForm: '2-17 Insurance Business',
        formCode: '2-17',
        pathwayId: 'pathway-3',
        regimeId: 'regime-1',
    },
];
