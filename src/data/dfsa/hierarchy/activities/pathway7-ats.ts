/**
 * Pathway 7: Operating an Alternative Trading System
 * Activities available under Selection_1.A7 (Regime 2: AMI)
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway7Activities: FinancialActivityHierarchy[] = [
    {
        id: 'ats-a1-operating-ats',
        code: 'ATS.A1',
        name: 'Operating an Alternative Trading System',
        description: 'Operating alternative trading platforms for securities and derivatives',
        products: [
            { code: 'ATS.A1.C1', name: 'Securities Trading Platform' },
            { code: 'ATS.A1.C2', name: 'Derivatives Trading Platform' },
            { code: 'ATS.A1.C3', name: 'Multi-Asset Platform' },
        ],
        triggersForm: '2-19 Alternative Trading System',
        formCode: '2-19',
        pathwayId: 'pathway-7',
        regimeId: 'regime-2',
    },
];
