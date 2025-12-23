/**
 * Pathway 8: Protected Cell Company (Insurance)
 * Activities available under Selection_1.A8
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway8Activities: FinancialActivityHierarchy[] = [
    {
        id: 'pcc-a1-operating-pcc',
        code: 'PCC.A1',
        name: 'Operating as a Protected Cell Company',
        description: 'Conducting insurance business through protected cell structures',
        products: [
            { code: 'PCC.A1.C1', name: 'Protected Cell Insurance' },
            { code: 'PCC.A1.C2', name: 'Segregated Portfolio Management' },
        ],
        triggersForm: '2-21 Protected Cell Company',
        formCode: '2-21',
        pathwayId: 'pathway-8',
        regimeId: 'regime-1',
    },
];
