/**
 * DFSA Financial Services Application Form Page
 */

import React from 'react';
import { FinancialServicesFormV2 } from '../../components/dfsa/forms';
import { FSApplicationFormData } from '../../types/dfsa';

export const FinancialServicesApplicationForm: React.FC = () => {
  const handleSave = async (
    formData: FSApplicationFormData,
    currentStep: string,
    completedSteps: string[]
  ) => {
    console.log('Saving form data:', { formData, currentStep, completedSteps });
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmit = async (formData: FSApplicationFormData) => {
    console.log('Submitting application:', formData);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Application submitted successfully! (Development mode)');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FinancialServicesFormV2
        mode="create"
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FinancialServicesApplicationForm;
