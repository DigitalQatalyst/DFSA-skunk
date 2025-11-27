import React, { useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import EnquiryModal from '../EnquiryModal';

const GetInvolved: React.FC = () => {
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  return (
    <>
      <section id="get-involved" className="relative bg-gradient-to-r from-primary/90 to-purple/90 text-white overflow-hidden">
        {/* Background image positioned to show woman's face on right third */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 w-full h-full">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1476&auto=format&fit=crop" alt="Woman entrepreneur" className="w-full h-full object-cover object-right-top md:object-right" style={{
              opacity: 0.6
            }} />
          </div>
        </div>
        {/* Gradient overlay with reduced opacity on right side */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(0, 48, 227, 0.85) 0%, rgba(149, 75, 249, 0.75) 40%, rgba(149, 75, 249, 0.4) 70%, rgba(149, 75, 249, 0.2) 100%)',
          mixBlendMode: 'multiply'
        }}></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display leading-tight">
                Join the Women Entrepreneurs Ecosystem
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Connect with a vibrant community of founders, mentors, and
                enablers. Share your story, access resources, and help shape the
                future of women's entrepreneurship in the UAE.
              </p>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-bold mb-2">For Entrepreneurs</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Access resources, mentorship, and funding opportunities to
                    grow your business.
                  </p>
                  <a href="https://dqproj.ciamlogin.com/fac25f94-6558-46ab-a790-6d7ff01c12d4/oauth2/v2.0/authorize?client_id=f996140d-d79b-419d-a64c-f211d23a38ad&scope=openid%20profile%20email%20offline_access%20User.Read&redirect_uri=https%3A%2F%2Fmzn-ejp-v2.vercel.app%2Fdashboard%2Foverview&client-request-id=0199f419-b732-70e1-96b5-afb4561be275&response_mode=fragment&client_info=1&nonce=0199f419-b73e-7598-8ec6-ccbd3c6984f0&state=eyJpZCI6IjAxOTlmNDE5LWI3MzUtNzBjMC1hYmM0LTUxMjk1M2EwZGU5MCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&x-client-SKU=msal.js.browser&x-client-VER=4.25.0&response_type=code&code_challenge=2belg2CJMTuyk2MmztOCAoqXyL_qWuQSRn47InRB1gE&code_challenge_method=S256" className="inline-flex items-center gap-1 text-white group">
                    <span className="group-hover:underline">
                      Join the Network
                    </span>
                    <ChevronRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h3 className="font-bold mb-2">For Organizations</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Partner with us to support women entrepreneurs and contribute
                    to the ecosystem.
                  </p>
                  <button onClick={() => setIsEnquiryModalOpen(true)} className="inline-flex items-center gap-1 text-white group bg-transparent border-none cursor-pointer">
                    <span className="group-hover:underline">
                      Become a Partner
                    </span>
                    <ChevronRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="https://dqproj.ciamlogin.com/fac25f94-6558-46ab-a790-6d7ff01c12d4/oauth2/v2.0/authorize?client_id=f996140d-d79b-419d-a64c-f211d23a38ad&scope=openid%20profile%20email%20offline_access%20User.Read&redirect_uri=https%3A%2F%2Fmzn-ejp-v2.vercel.app%2Fdashboard%2Foverview&client-request-id=0199f419-b732-70e1-96b5-afb4561be275&response_mode=fragment&client_info=1&nonce=0199f419-b73e-7598-8ec6-ccbd3c6984f0&state=eyJpZCI6IjAxOTlmNDE5LWI3MzUtNzBjMC1hYmM0LTUxMjk1M2EwZGU5MCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&x-client-SKU=msal.js.browser&x-client-VER=4.25.0&response_type=code&code_challenge=2belg2CJMTuyk2MmztOCAoqXyL_qWuQSRn47InRB1gE&code_challenge_method=S256" className="relative bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-all duration-300 group overflow-hidden">
                  {/* Animated glow effect */}
                  <span className="absolute inset-0 w-full h-full bg-white rounded-lg animate-pulse-glow opacity-0 group-hover:opacity-30"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Join the Network
                    <ChevronRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
                <button onClick={() => setIsEnquiryModalOpen(true)} className="relative bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 group overflow-hidden cursor-pointer">
                  {/* Animated glow effect */}
                  <span className="absolute inset-0 w-full h-full bg-white rounded-lg animate-pulse-glow opacity-0 group-hover:opacity-10"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    Partner With Us
                    <ChevronRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
      <EnquiryModal 
        isOpen={isEnquiryModalOpen} 
        onClose={() => setIsEnquiryModalOpen(false)}
        data-id="women-entrepreneurs-partner"
      />
    </>
  );
};
export default GetInvolved;