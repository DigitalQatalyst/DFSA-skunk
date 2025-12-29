import React from "react";
import { AlertCircle, ExternalLink, BookOpen, Shield } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

/**
 * DFSA Decision Authority Statement Section
 * Critical compliance component - explains DFSA's role as statutory regulator
 */
const DFSADecisionAuthoritySection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll>
          <div className="max-w-5xl mx-auto">
            {/* Alert Header */}
            <div className="flex items-start gap-4 mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  Important Information: DFSA Authorisation Process
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  The Dubai Financial Services Authority (DFSA) is the statutory regulator for
                  financial services in the Dubai International Financial Centre (DIFC).
                </p>
              </div>
            </div>

            {/* Key Points Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <Shield className="text-primary mb-3" size={28} />
                <h3 className="font-bold text-lg mb-2 text-gray-900">DFSA Authority</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  All authorisation decisions are made by DFSA in accordance with DFSA Law
                  and the DFSA Rulebook. DFSA determines application requirements, processing
                  timelines, and approval outcomes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <BookOpen className="text-primary mb-3" size={28} />
                <h3 className="font-bold text-lg mb-2 text-gray-900">Our Role</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  This platform provides documentation preparation and procedural guidance only.
                  We do not provide legal advice, investment advice, or regulatory opinions.
                </p>
              </div>
            </div>

            {/* Critical Disclaimers */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Important Limitations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-0.5">•</span>
                  <span>Submission of an application does not guarantee approval or any specific timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-0.5">•</span>
                  <span>Requirements may change; refer to the DFSA Rulebook for authoritative information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold mt-0.5">•</span>
                  <span>DFSA may request additional information or conduct further assessments based on individual circumstances</span>
                </li>
              </ul>
            </div>

            {/* DFSA Public Resources */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">DFSA Public Resources</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <a
                  href="https://www.dfsa.ae/rulebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">DFSA Rulebook</span>
                </a>
                <a
                  href="https://www.dfsa.ae/public-register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">DFSA Public Register</span>
                </a>
                <a
                  href="https://www.dfsa.ae/application-forms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">Application Forms</span>
                </a>
                <a
                  href="https://www.dfsa.ae/getmedia/d87f1b3a-4c0c-4f0e-8b0f-f6e8c0a5c8d5/Fee-Schedule.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="text-sm font-medium">Fee Schedule</span>
                </a>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default DFSADecisionAuthoritySection;
