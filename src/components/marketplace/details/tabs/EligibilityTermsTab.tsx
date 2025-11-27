import React from "react";
import { CheckCircleIcon } from "lucide-react";

export interface EligibilityTermsTabProps {
  item: any;
  providerName: string;
}

const EligibilityTermsTab: React.FC<EligibilityTermsTabProps> = ({ item, providerName }) => {
  // Parse KeyTermsOfService if it's a JSON string or split by delimiters
  const parseTerms = (terms: any): string[] => {
    if (!terms) return [];
    if (Array.isArray(terms)) return terms;
    if (typeof terms === 'string') {
      try {
        const parsed = JSON.parse(terms);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Not JSON, try splitting by common delimiters
        return terms.split(/[•\n]/).map((t: string) => t.trim()).filter((t: string) => t);
      }
    }
    return [String(terms)];
  };

  const keyTermsList = parseTerms(item.keyTerms || item.KeyTermsOfService);
  const hasMultipleTerms = keyTermsList.length > 1;

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">
        Review eligibility requirements and terms & conditions for this service.
      </p>
      {/* Eligibility Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Eligibility Requirements</h3>
        <ul className="space-y-2">
          {item.eligibilityCriteria ? (
            item.eligibilityCriteria.map((criteria: string, index: number) => (
              <li key={index} className="flex items-start">
                <CheckCircleIcon size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{criteria}</span>
              </li>
            ))
          ) : (
            <li className="flex items-start">
              <CheckCircleIcon size={16} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span className="text-gray-700">
                {item.eligibility || item.BusinessStage 
                  ? `Available for businesses at the ${item.BusinessStage || item.businessStage || "any"} stage` 
                  : "Eligibility criteria will be determined during the application process"}
              </span>
            </li>
          )}
        </ul>
        <div className="mt-6 bg-blue-50 rounded-lg p-3">
          <h4 className="text-md font-medium text-blue-800 mb-2">Not sure if you qualify?</h4>
          <p className="text-gray-700 mb-3 text-sm">
            Contact {providerName} for a preliminary eligibility assessment before submitting your full application.
          </p>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">Contact Provider</button>
        </div>
      </div>
      {/* Terms Section */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
        {keyTermsList.length > 0 ? (
          <>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Key Terms</h4>
            {hasMultipleTerms ? (
              <ul className="space-y-2 mb-4">
                {keyTermsList.map((term: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    <span className="text-gray-700">{term}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 mb-4">{keyTermsList[0]}</p>
            )}
          </>
        ) : (
          <>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Key Terms</h4>
            <p className="text-gray-700 mb-4">
              Terms and conditions will be provided during the application process.
            </p>
          </>
        )}
        {item.additionalTerms && item.additionalTerms.length > 0 && (
          <>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Additional Terms</h4>
            <ul className="space-y-2">
              {item.additionalTerms.map((term: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span className="text-gray-700">{term}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="text-sm text-gray-500 italic">
        The information provided here is a summary of key terms and conditions. The full terms and conditions will be
        provided in the final agreement. {providerName} reserves the right to modify these terms at their discretion.
      </div>
    </div>
  );
};

export default EligibilityTermsTab;
