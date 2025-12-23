/**
 * Pathway 5: Money Services Business
 * Activities available under Selection_1.A5
 */

import { FinancialActivityHierarchy } from '../../types';

export const pathway5Activities: FinancialActivityHierarchy[] = [
    {
        id: 'msb-a1-arranging-advising',
        code: 'MSB.A1',
        name: 'Arranging or Advising on Money Services',
        description: 'Arranging or advising on payment and money transmission services',
        products: [
            { code: 'MSB.A1.C1', name: 'Payment Account' },
            { code: 'MSB.A1.C2', name: 'Money Transmission' },
            { code: 'MSB.A1.C3', name: 'Payment Account Transactions' },
            { code: 'MSB.A1.C4', name: 'Payment Instruments' },
        ],
        triggersForm: '2-10 Money Services',
        formCode: '2-10',
        pathwayId: 'pathway-5',
        regimeId: 'regime-1',
    },
    {
        id: 'msb-a2-providing',
        code: 'MSB.A2',
        name: 'Providing Money Services',
        description: 'Providing payment services, money transmission, and stored value',
        products: [
            { code: 'MSB.A2.C1', name: 'Providing/Operating a Payment Account' },
            { code: 'MSB.A2.C2', name: 'Providing Money Transmission' },
            { code: 'MSB.A2.C3', name: 'Executing Payment Transactions' },
            { code: 'MSB.A2.C4', name: 'Issuing Payment Instruments' },
            { code: 'MSB.A2.C5', name: 'Issuing Stored Value' },
        ],
        triggersForm: '2-10 Money Services',
        formCode: '2-10',
        pathwayId: 'pathway-5',
        regimeId: 'regime-1',
    },
];
