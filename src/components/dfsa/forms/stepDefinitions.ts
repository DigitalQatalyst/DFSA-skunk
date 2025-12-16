/**
 * DFSA Financial Services Form Step Definitions
 *
 * Defines all form steps, their visibility rules, and navigation structure
 * Requirements: 1.2, 1.3, 7.1, 7.2, 7.3
 */

import { StepDefinition, FSApplicationFormData } from '../../../types/dfsa';
import { getVisibleSteps } from './rulesEngine';

export const FORM_STEPS: StepDefinition[] = [
  // Stage 1: General Requirements (Always visible)
  {
    id: 'step-1-1',
    stage: 1,
    name: 'Introduction & Disclosure',
    component: 'Step1_1_IntroductionDisclosure',
    visibility: 'always'
  },
  {
    id: 'step-1-2',
    stage: 1,
    name: 'Standing Data',
    component: 'Step1_2_StandingData',
    visibility: 'always'
  },
  {
    id: 'step-1-3',
    stage: 1,
    name: 'Ownership Information',
    component: 'Step1_3_OwnershipInformation',
    visibility: 'always'
  },
  {
    id: 'step-1-4',
    stage: 1,
    name: 'Controllers & Group Structure',
    component: 'Step1_4_ControllersGroupStructure',
    visibility: 'always'
  },
  {
    id: 'step-1-5',
    stage: 1,
    name: 'Permissions & Financial Services',
    component: 'Step1_5_PermissionsFinancialServices',
    visibility: 'always'
  },

  // Stage 2: Activity-Specific Steps (Conditional based on Step 1-5 selections)
  {
    id: 'step-2-1',
    stage: 2,
    name: 'Fund Management',
    component: 'Step2_1_FundManagement',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A10.length > 0 || financialServicesMatrix.A11.length > 0 || financialServicesMatrix.A13.length > 0'
  },
  {
    id: 'step-2-2',
    stage: 2,
    name: 'Representative Office',
    component: 'Step2_2_RepresentativeOffice',
    visibility: 'conditional',
    triggerCondition: 'isRepresentativeOffice === true'
  },
  {
    id: 'step-2-3',
    stage: 2,
    name: 'Islamic Endorsement',
    component: 'Step2_3_IslamicEndorsement',
    visibility: 'conditional',
    triggerCondition: 'endorsementSelections.E1_A1 === true'
  },
  {
    id: 'step-2-4',
    stage: 2,
    name: 'Advising & Arranging',
    component: 'Step2_4_AdvisingArranging',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A6.length > 0 || financialServicesMatrix.A7.length > 0 || financialServicesMatrix.A8.length > 0 || financialServicesMatrix.A9.length > 0 || financialServicesMatrix.A14.length > 0'
  },
  {
    id: 'step-2-5',
    stage: 2,
    name: 'Insurance Intermediation',
    component: 'Step2_5_InsuranceIntermediation',
    visibility: 'conditional',
    triggerCondition: '(activitySelections.A2 === true || activitySelections.A3 === true) && (financialServicesMatrix.A8.length > 0 || financialServicesMatrix.A9.length > 0)'
  },
  {
    id: 'step-2-6',
    stage: 2,
    name: 'Asset Management',
    component: 'Step2_6_AssetManagement',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A5.length > 0 || financialServicesMatrix.A7.length > 0 || financialServicesMatrix.A10.length > 0 || financialServicesMatrix.A11.length > 0 || financialServicesMatrix.A13.length > 0'
  },
  {
    id: 'step-2-7',
    stage: 2,
    name: 'Sales & Trading',
    component: 'Step2_7_SalesTrading',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A4.length > 0 || financialServicesMatrix.A5.length > 0 || financialServicesMatrix.A14.length > 0'
  },
  {
    id: 'step-2-10',
    stage: 2,
    name: 'Money Services',
    component: 'Step2_10_MoneyServices',
    visibility: 'conditional',
    triggerCondition: 'activitySelections.A5 === true'
  },
  {
    id: 'step-2-11',
    stage: 2,
    name: 'Direct Insurance',
    component: 'Step2_11_DirectInsurance',
    visibility: 'conditional',
    triggerCondition: 'activitySelections.A2 === true'
  },
  {
    id: 'step-2-12',
    stage: 2,
    name: 'Banking',
    component: 'Step2_12_Banking',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A1.length > 0 || financialServicesMatrix.A2.length > 0 || activitySelections.A6 === true'
  },
  {
    id: 'step-2-13',
    stage: 2,
    name: 'Retail Endorsement',
    component: 'Step2_13_RetailEndorsement',
    visibility: 'conditional',
    triggerCondition: 'endorsementSelections.E2_A1 === true'
  },
  {
    id: 'step-2-14',
    stage: 2,
    name: 'Client Assets',
    component: 'Step2_14_ClientAssets',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A4.length > 0 || financialServicesMatrix.A11.length > 0 || financialServicesMatrix.A17.length > 0 || endorsementSelections.E2_A5 === true'
  },
  {
    id: 'step-2-21',
    stage: 2,
    name: 'Crowdfunding',
    component: 'Step2_21_Crowdfunding',
    visibility: 'conditional',
    triggerCondition: 'financialServicesMatrix.A14.length > 0 || financialServicesMatrix.A18.length > 0'
  },

  // Stage 3: Core Profile (Conditional - hidden for Representative Office only)
  {
    id: 'step-3-1',
    stage: 3,
    name: 'Business Plan',
    component: 'Step3_1_BusinessPlan',
    visibility: 'conditional',
    triggerCondition: '!(isRepresentativeOffice === true && noOtherActivities)'
  },
  {
    id: 'step-3-2',
    stage: 3,
    name: 'Clients',
    component: 'Step3_2_Clients',
    visibility: 'conditional',
    triggerCondition: '!(isRepresentativeOffice === true && noOtherActivities)'
  },
  {
    id: 'step-3-4',
    stage: 3,
    name: 'Risk Management & Compliance',
    component: 'Step3_4_RiskManagementCompliance',
    visibility: 'conditional',
    triggerCondition: '!(isRepresentativeOffice === true && noOtherActivities)'
  },
  {
    id: 'step-3-5',
    stage: 3,
    name: 'Governance',
    component: 'Step3_5_Governance',
    visibility: 'conditional',
    triggerCondition: '!(isRepresentativeOffice === true && noOtherActivities)'
  },

  // Stage 4: Final Submission (Always visible)
  {
    id: 'step-4-1',
    stage: 4,
    name: 'Waivers & Modifications',
    component: 'Step4_1_WaiversModifications',
    visibility: 'always'
  },
  {
    id: 'step-4-2',
    stage: 4,
    name: 'Application Fees',
    component: 'Step4_2_ApplicationFees',
    visibility: 'always'
  },
  {
    id: 'step-4-3',
    stage: 4,
    name: 'Fit & Proper Declarations',
    component: 'Step4_3_FitProperDeclarations',
    visibility: 'always'
  },
  {
    id: 'step-4-4',
    stage: 4,
    name: 'Review & Submit',
    component: 'Step4_4_ReviewSubmit',
    visibility: 'always'
  }
];

export const STAGE_NAMES: Record<number, string> = {
  1: 'General Requirements',
  2: 'Activity-Specific Information',
  3: 'Core Profile',
  4: 'Final Submission'
};

/**
 * Evaluates step visibility based on form data using the rules engine
 */
export function evaluateStepVisibility(formData: FSApplicationFormData): string[] {
  return getVisibleSteps(formData);
}

/**
 * Gets the step definition by ID
 */
export function getStepById(stepId: string): StepDefinition | undefined {
  return FORM_STEPS.find(step => step.id === stepId);
}

/**
 * Gets all steps for a specific stage
 */
export function getStepsByStage(stage: number): StepDefinition[] {
  return FORM_STEPS.filter(step => step.stage === stage);
}
