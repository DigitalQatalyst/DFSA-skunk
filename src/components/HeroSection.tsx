import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  AnimatedText,
  FadeInUpOnScroll,
} from "./AnimationUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { AISearchBar } from "./ai/AISearchBar";
import { FullScreenChat } from "./FullScreenChat";

interface HeroSectionProps {
  "data-id"?: string;
}

/**
 * DFSA Hero Section
 * Professional landing section for DFSA Regulatory Services Platform
 */
const HeroSection: React.FC<HeroSectionProps> = ({ "data-id": dataId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState('');

  // Scroll to consultation form
  const scrollToConsultation = () => {
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#consultation" });
      return;
    }
    const el =
      document.getElementById("consultation") ||
      document.getElementById("contact");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll to contact section
  const scrollToContact = () => {
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#contact" });
      return;
    }
    const el = document.getElementById("contact");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="relative w-full bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: "url('/dfsa_hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      data-id={dataId}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-800/80"></div>

      {/* Animated gradient overlay with DFSA colors */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-dfsa-gold/10 to-dfsa-teal/10 mix-blend-overlay"
        style={{
          animation: "pulse-gradient 8s ease-in-out infinite alternate",
        }}
      ></div>

      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 h-full flex flex-col justify-center items-center relative z-10">
        {/* Main Content - DFSA Agents Hub */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          {/* Headline with animated text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            <AnimatedText
              text="DFSA Regulatory Advisor"
              gap="0.5rem"
            />
          </h1>

          {/* Subheadline */}
          <FadeInUpOnScroll delay={0.8}>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-body">
              Get expert guidance on DFSA services and products
            </p>
          </FadeInUpOnScroll>

          {/* Chat Interface - Main CTA */}
          <FadeInUpOnScroll delay={1.0}>
            <div className="w-full max-w-3xl mx-auto mt-8 mb-12">
              <div
                onClick={() => {
                  setIsChatOpen(true);
                  setChatInitialMessage('');
                }}
                className="cursor-pointer"
              >
                <AISearchBar
                  placeholder="Ask me anything about DFSA services and products..."
                  systemPrompt="You are the DFSA Regulatory Advisor. Your role is to guide users through understanding and using DFSA Services & Products. Follow this conversation flow: Step 00 - Greet and introduce yourself. Step 01 - Ask what type of user they are (DFSA Licensed, DFSA Aspiring, or Other). Step 02 - Ask what type of firms they're enquiring about (DFSA Authorised Firms, DNFBPs, Market Institution, Auditors, or Unsure). Step 03 - Provide targeted guidance based on their selections. Be conversational, helpful, and professional."
                  className="w-full"
                />
              </div>
            </div>
          </FadeInUpOnScroll>
        </div>

        {/* Trust Indicators */}
        {/* <FadeInUpOnScroll delay={1.6}>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-dfsa-teal rounded-full"></div>
              <span>Former DFSA Supervisors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-dfsa-gold rounded-full"></div>
              <span>Documentation Preparation Services</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>DFSA Determines All Authorisation Outcomes</span>
            </div>
          </div>
        </FadeInUpOnScroll> */}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => {
          const nextSection = document.querySelector("main > div:nth-child(2)");
          nextSection?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        <div className="flex flex-col items-center">
          <ChevronDown size={28} className="text-white/80" />
          <span className="text-white/60 text-xs mt-1">Scroll to explore</span>
        </div>
      </div>

      {/* Keyframes for gradient animation */}
      <style>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>

      {/* Full Screen Chat Modal */}
      <FullScreenChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={chatInitialMessage}
        systemPrompt="You are a helpful support assistant for the DFSA (Dubai Financial Services Authority). Guide users through their questions about our platform services, funding applications, and business resources. Provide accurate, professional, and concise responses about DFSA regulations and requirements."
      />
    </div>
  );
};

export default HeroSection;
