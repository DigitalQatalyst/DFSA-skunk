import React from "react";

export interface ApplicationProcessTabProps {
  process?: { title: string; description: string }[] | string;
}

const ApplicationProcessTab: React.FC<ApplicationProcessTabProps> = ({ process }) => {
  // Parse the process data
  const parseSteps = (data: any): { title: string; description: string }[] => {
    // If it's already an array of objects
    if (Array.isArray(data)) {
      return data
        .map((step: any) => {
          if (typeof step === 'string') {
            return { title: step, description: '' };
          }
          if (step && typeof step === 'object') {
            return {
              title: step.title || step.name || '',
              description: step.description || ''
            };
          }
          return null;
        })
        .filter((s): s is { title: string; description: string } => s !== null && s.title !== '');
    }
    
    // If it's a JSON string
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parseSteps(parsed);
        }
      } catch (e) {
        // Not JSON, try splitting by newlines or bullet points
        const lines = data.split(/\n|•/).map(l => l.trim()).filter(l => l);
        if (lines.length > 0) {
          return lines.map(line => ({ title: line, description: '' }));
        }
      }
    }
    
    return [];
  };

  const steps = parseSteps(process);
  
  const fallback = [
    { title: "Submit Application", description: "Complete the online application form with your business details and required information." },
    { title: "Document Verification", description: "Upload required documents for verification and wait for our team to review them." },
    { title: "Review & Approval", description: "Our team will review your application and contact you with a decision within 5-7 business days." },
  ];
  
  // Use parsed steps if available, otherwise use fallback
  const list = steps.length > 0 ? steps : fallback;

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">Follow these simple steps to complete your application.</p>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="space-y-3">
          {list.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-gray-500 font-medium">{index + 1}.</span>
              <div>
                <h4 className="font-medium text-gray-900">{step.title}</h4>
                {step.description && (
                  <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationProcessTab;
