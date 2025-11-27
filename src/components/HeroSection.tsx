import React from "react";
import { ChevronDown, ArrowRight, Calendar } from "lucide-react";
import {
  AnimatedText,
  FadeInUpOnScroll,
  StaggeredFadeIn,
  AnimatedCounter,
} from "./AnimationUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { trustMetrics } from "../data/dfsa";

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

  // Scroll to consultation form
  const scrollToConsultation = () => {
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#consultation" });
      return;
    }
    const el = document.getElementById("consultation") || document.getElementById("contact");
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
        backgroundImage: "url('/heroImage.png')",
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
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 h-full flex flex-col justify-center items-center relative z-10">
        {/* Main Content */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          {/* Headline with animated text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            <AnimatedText
              text="Navigate DFSA Authorization with Confidence"
              gap="0.5rem"
            />
          </h1>

          {/* Subheadline */}
          <FadeInUpOnScroll delay={0.8}>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-body">
              Expert guidance for financial services firms seeking regulatory approval and compliance excellence in the DIFC.
            </p>
          </FadeInUpOnScroll>

          {/* Trust Metrics - Animated Badges */}
          <FadeInUpOnScroll delay={1.0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 max-w-4xl mx-auto">
              {trustMetrics.map((metric, index) => (
                <div
                  key={metric.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  style={{
                    animationDelay: `${1.2 + index * 0.1}s`,
                  }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {metric.id === 'average-timeline' ? (
                      <span>{metric.value} mo</span>
                    ) : (
                      <AnimatedCounter end={metric.value} suffix={metric.id === 'success-rate' ? '%' : '+'} />
                    )}
                  </div>
                  <div className="text-sm md:text-base text-white/80 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeInUpOnScroll>
        </div>

        {/* Call to Action Buttons */}
        <StaggeredFadeIn
          staggerDelay={0.15}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <button
            onClick={scrollToConsultation}
            className="px-8 py-4 bg-white text-primary hover:bg-gray-50 font-bold text-lg rounded-lg shadow-xl
                       transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                       flex items-center justify-center gap-2 group"
          >
            <span className="relative z-10">Start Your Authorization Journey</span>
            <ArrowRight
              size={20}
              className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
          </button>

          <button
            onClick={scrollToContact}
            className="px-8 py-4 bg-dfsa-gold hover:bg-dfsa-gold-700 text-white font-bold text-lg rounded-lg shadow-xl
                       flex items-center justify-center gap-2 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <Calendar size={20} />
            <span>Schedule Consultation</span>
          </button>
        </StaggeredFadeIn>

        {/* Trust Indicators */}
        <FadeInUpOnScroll delay={1.6}>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-dfsa-teal rounded-full"></div>
              <span>Former DFSA Supervisors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-dfsa-gold rounded-full"></div>
              <span>95% First-Time Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Full Compliance Support</span>
            </div>
          </div>
        </FadeInUpOnScroll>
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
      <style jsx>{`
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
    </div>
  );
};

export default HeroSection;
