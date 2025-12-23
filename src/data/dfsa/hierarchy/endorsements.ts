/**
 * DFSA Endorsements
 * Additional permissions and restrictions that can be applied to authorizations
 */

import { Endorsement } from '../types';

export const endorsements: Endorsement[] = [
    {
        id: 'islamic-finance',
        code: 'Endorsement2.A1',
        name: 'Islamic Finance Endorsement',
        applicableTo: 'Regime 1 (Authorised Firms)',
        effect: 'Permits conduct of Sharia-compliant financial activities',
        triggersForm: '2-3 Islamic Endorsement',
        regulatoryModule: 'IFR (Islamic Finance Rules)',
    },
    {
        id: 'retail',
        code: 'Endorsement2.A2',
        name: 'Retail Endorsement',
        applicableTo: 'Regime 1 (Authorised Firms)',
        effect: 'Permits serving Retail Clients (in addition to Professional Clients)',
        triggersForm: '2-13 Retail Endorsement',
        regulatoryModule: 'COB (Conduct of Business)',
    },
    {
        id: 'lti',
        code: 'Endorsement2.A3',
        name: 'Long Term Insurance (LTI) Endorsement',
        applicableTo: 'Regime 1 (Authorised Firms) with A2.C7 or A4.C7',
        effect: 'Permits advising/arranging LTI products to Retail Clients',
        triggersForm: '2-13 Retail Endorsement (LTI section)',
        regulatoryModule: 'COB 6.15',
    },
    {
        id: 'professional-client',
        code: 'Endorsement2.A4',
        name: 'Professional Client Restriction',
        applicableTo: 'Regime 1 (Authorised Firms)',
        effect: 'Restricts firm to serving Professional Clients only (default position)',
    },
];
