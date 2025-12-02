import { DFSAFactMetric } from '../../types/dfsa';

/**
 * DFSA Regulatory Information Metrics
 * Educational facts about DFSA authorisation process
 * Compliant with DFSA operating rules - no outcome predictions
 */
export const dfsaFactMetrics: DFSAFactMetric[] = [
  {
    id: 'licence-categories',
    value: 8,
    label: 'Licence Categories',
    description: 'Different authorisation categories available from DFSA',
    icon: 'Layers',
    ruleReference: 'AUT Module 3.1',
  },
  {
    id: 'core-documents',
    value: 10,
    label: 'Core Documents Required',
    description: 'Typical documents required for Category 3 applications',
    icon: 'FileText',
  },
  {
    id: 'regulatory-experience',
    value: 15,
    label: 'Years Combined Experience',
    description: 'Team includes individuals with regulatory experience',
    icon: 'Users',
  },
  {
    id: 'rulebook-modules',
    value: 12,
    label: 'DFSA Rulebook Modules',
    description: 'Key modules applicable to authorisation and supervision',
    icon: 'BookOpen',
  },
];
