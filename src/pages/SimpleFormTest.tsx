import React from 'react';
import { FormLayout } from '../components/layouts/FormLayout';

const SimpleFormTest: React.FC = () => {
  return (
    <FormLayout 
      data-id="simple-form-test" 
      isLoggedIn={true}
      showSidebar={true}
      onboardingComplete={true}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Simple Form Test</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>This is a test to see if FormLayout works with sidebar.</p>
          <p>If you can see this with a sidebar, then FormLayout is working!</p>
        </div>
      </div>
    </FormLayout>
  );
};

export default SimpleFormTest;