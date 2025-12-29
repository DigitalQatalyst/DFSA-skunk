/**
 * Pathway 2: Insurance (General) Business
 * Activities available under Selection_1.A2
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway2Activities: FinancialActivityHierarchy[] = [
    {
        id: 'gi-a1-effecting-contracts',
        code: 'GI.A1',
        name: 'Effecting Contracts of Insurance',
        description: 'Underwriting general insurance contracts as principal',
        products: [
            { code: 'GI.A1.C1', name: 'Property Insurance' },
            { code: 'GI.A1.C2', name: 'Casualty Insurance' },
            { code: 'GI.A1.C3', name: 'Marine Insurance' },
            { code: 'GI.A1.C4', name: 'Aviation Insurance' },
            { code: 'GI.A1.C5', name: 'Credit Insurance' },
            { code: 'GI.A1.C6', name: 'General Liability' },
        ],
        triggersForm: '2-17 Insurance Business',
        formCode: '2-17',
        pathwayId: 'pathway-2',
        regimeId: 'regime-1',
    },
    {
        id: 'gi-a2-carrying-out-contracts',
        code: 'GI.A2',
        name: 'Carrying Out Contracts of Insurance',
        description: 'Managing and administering general insurance contracts',
        products: [
            { code: 'GI.A2.C1', name: 'Claims Management' },
            { code: 'GI.A2.C2', name: 'Policy Administration' },
        ],
        triggersForm: '2-17 Insurance Business',
        formCode: '2-17',
        pathwayId: 'pathway-2',
        regimeId: 'regime-1',
    },
];
