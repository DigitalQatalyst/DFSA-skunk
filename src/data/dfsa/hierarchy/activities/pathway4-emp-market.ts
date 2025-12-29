/**
 * Pathway 4: Employee Money Purchase Scheme / Market Operator
 * Activities available under Selection_1.A4 (Regime 2: AMI)
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway4Activities: FinancialActivityHierarchy[] = [
    {
        id: 'emp-a1-operating-scheme',
        code: 'EMP.A1',
        name: 'Operating an Employee Money Purchase Scheme',
        description: 'Establishing and operating employee pension schemes',
        products: [
            { code: 'EMP.A1.C1', name: 'Defined Contribution Schemes' },
            { code: 'EMP.A1.C2', name: 'Money Purchase Arrangements' },
        ],
        triggersForm: '2-20 Employee Scheme',
        formCode: '2-20',
        pathwayId: 'pathway-4',
        regimeId: 'regime-2',
    },
    {
        id: 'mo-a1-operating-market',
        code: 'MO.A1',
        name: 'Operating as a Market Operator',
        description: 'Operating market infrastructure and trading facilities',
        products: [
            { code: 'MO.A1.C1', name: 'Market Operations' },
            { code: 'MO.A1.C2', name: 'Trading Infrastructure' },
        ],
        triggersForm: '2-14 Market Infrastructure',
        formCode: '2-14',
        pathwayId: 'pathway-4',
        regimeId: 'regime-2',
    },
];
