/**
 * Pathway 9: Representative Office
 * Activities available under Rep_Office_Selection.A1
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway9Activities: FinancialActivityHierarchy[] = [
    {
        id: 'rep-office-marketing',
        code: 'REP.A1',
        name: 'Marketing Activities',
        description: 'Conducting marketing and promotional activities only (no financial services permitted)',
        products: [
            { code: 'REP.A1.C1', name: 'Marketing Services' },
            { code: 'REP.A1.C2', name: 'Promotional Activities' },
            { code: 'REP.A1.C3', name: 'Liaison Services' },
        ],
        triggersForm: '2-16 Representative Office',
        formCode: '2-16',
        pathwayId: 'pathway-9',
        regimeId: 'regime-3',
    },
];
