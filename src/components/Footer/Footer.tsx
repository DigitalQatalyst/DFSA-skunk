import React, { useState } from "react";
import { ExternalLink, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
interface FooterProps {
  "data-id"?: string;
  isLoggedIn?: boolean;
}
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
}
function AccordionSection({ title, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-blue-500 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-base text-white">{title}</h3>
        {isOpen ? (
          <ChevronUp size={20} className="text-blue-100" />
        ) : (
          <ChevronDown size={20} className="text-blue-100" />
        )}
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}
export function Footer({ "data-id": dataId, isLoggedIn = false }: FooterProps) {
  // State for email input and validation (must be declared before any early returns)
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  // Minimal App Footer (Post-login)
  if (isLoggedIn) {
    return (
      <footer
        data-id={dataId}
        className="bg-gray-50 border-t border-gray-100 w-full h-14"
      >
        <div className=" px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>© 2025 Enterprise Journey</span>
            <span className="hidden sm:inline">v2.1.0</span>
          </div>
          {/* <a href="/dashboard/support" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
            Support
          </a> */}
        </div>
      </footer>
    );
  }

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Helper function to get subscribed emails from localStorage
  const getSubscribedEmails = (): Set<string> => {
    try {
      const stored = localStorage.getItem("newsletter_subscriptions");
      if (stored) {
        const emails = JSON.parse(stored) as string[];
        return new Set(emails.map((e: string) => e.toLowerCase().trim()));
      }
    } catch (error) {
      console.error("Error reading newsletter subscriptions:", error);
    }
    return new Set<string>();
  };

  // Helper function to save subscribed email to localStorage
  const saveSubscribedEmail = (email: string): void => {
    try {
      const emails = getSubscribedEmails();
      emails.add(email.toLowerCase().trim());
      localStorage.setItem(
        "newsletter_subscriptions",
        JSON.stringify(Array.from(emails))
      );
    } catch (error) {
      console.error("Error saving newsletter subscription:", error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsDuplicate(false);
    setErrorMessage(null);
    if (value === "") {
      setIsValid(true);
    } else {
      setIsValid(validateEmail(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous states
    setErrorMessage(null);
    setIsDuplicate(false);

    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate subscription
    const subscribedEmails = getSubscribedEmails();
    if (subscribedEmails.has(normalizedEmail)) {
      setIsDuplicate(true);
      setErrorMessage("This email is already subscribed to our newsletter.");
      return;
    }

    setIsSubmitting(true);
    setIsValid(true);

    try {
      const response = await fetch(
        "https://kfrealexpressserver.vercel.app/api/v1/contact/create-newsletter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            source: "website",
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        // Check if it's a duplicate error from the backend
        if (
          response.status === 409 ||
          errorText.toLowerCase().includes("duplicate") ||
          errorText.toLowerCase().includes("already")
        ) {
          setIsDuplicate(true);
          setErrorMessage(
            "This email is already subscribed to our newsletter."
          );
          // Save to localStorage even if backend says duplicate (user already subscribed)
          saveSubscribedEmail(normalizedEmail);
          return;
        }
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Newsletter subscription successful:", result);

      // Save to localStorage to prevent duplicate submissions
      saveSubscribedEmail(normalizedEmail);

      // Show success message
      setIsSubmitted(true);
      setEmail("");

      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error: unknown) {
      console.error("Newsletter subscription error:", error);
      const message =
        (error as Error)?.message ||
        "Failed to subscribe. Please try again later.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Full Website Footer (Pre-login)
  return (
    <footer data-id={dataId} className="bg-blue-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Logo */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              ENTERPRISE
              <br />
              JOURNEY
            </h2>
          </div>
          {/* Newsletter - Mobile Full Width */}
          <div className="mb-8">
            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
              Stay updated with the latest business insights, opportunities, and
              services from Enterprise Journey.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                    !isValid
                      ? "border-2 border-red-500"
                      : "border border-gray-300 focus:ring-blue-400"
                  }`}
                  aria-label="Email address for newsletter"
                  aria-invalid={!isValid}
                  aria-describedby={!isValid ? "email-error" : undefined}
                />
                {!isValid && !errorMessage && (
                  <p id="email-error" className="mt-1 text-sm text-red-200">
                    Please enter a valid email address
                  </p>
                )}
                {errorMessage && (
                  <p
                    className={`mt-1 text-sm ${
                      isDuplicate ? "text-yellow-200" : "text-red-200"
                    }`}
                  >
                    {errorMessage}
                  </p>
                )}
                {isSubmitted && !errorMessage && (
                  <p className="mt-1 text-sm text-green-200">
                    Thank you for subscribing!
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-white text-blue-600 px-4 py-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe to newsletter"
                disabled={!email.trim() || !isValid || isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
          {/* Accordion Sections */}
          <div className="mb-8">
            <AccordionSection title="Get to Know Us">
              <ul className="space-y-3">
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    About Enterprise Journey
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Help Centre
                  </a>
                </li>
                <li>
                  <a
                    href="/discover-abudhabi"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Discover Abu Dhabi
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </AccordionSection>
            <AccordionSection title="For You">
              <ul className="space-y-3">
                <li>
                  <a
                    href="/marketplace/financial"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Financial Services
                  </a>
                </li>
                <li>
                  <a
                    href="/marketplace/non-financial"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Business Services Hub
                  </a>
                </li>
                <li>
                  <a
                    href="https://ujs.qxk.mybluehost.me/website_e550b4e3/"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Business Communities
                  </a>
                </li>
                <li>
                  <a
                    href="/marketplace/knowledge-hub"
                    className="text-blue-100 hover:text-white transition-colors text-sm block"
                  >
                    Knowledge Hub
                  </a>
                </li>
              </ul>
            </AccordionSection>
            <AccordionSection title="Find Us">
              <ul className="space-y-3">
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                    <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                    <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
            </AccordionSection>
          </div>
          {/* Copyright - Mobile */}
          <div className="border-t border-blue-500 pt-6 text-center">
            <p className="text-blue-100 text-xs">
              2025 Enterprise Journey. All rights reserved.
            </p>
            <p className="text-blue-100 text-xs mt-1">v2.1.0</p>
          </div>
        </div>
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {/* Main Footer Content */}
          <div className="grid grid-cols-4 gap-12 mb-8">
            {/* Logo and Newsletter Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">
                  ENTERPRISE
                  <br />
                  JOURNEY
                </h2>
              </div>
              <div className="mb-6">
                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                  Stay updated with the latest business insights, opportunities,
                  and services from Enterprise Journey.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 pr-12 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 ${
                        !isValid
                          ? "border-2 border-red-500"
                          : "border border-gray-300 focus:ring-blue-400"
                      }`}
                      aria-label="Email address for newsletter"
                      aria-invalid={!isValid}
                      aria-describedby={
                        !isValid ? "desktop-email-error" : undefined
                      }
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Subscribe to newsletter"
                      disabled={!email.trim() || !isValid || isSubmitting}
                      title={isSubmitting ? "Subscribing..." : "Subscribe"}
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <ArrowRight size={16} />
                      )}
                    </button>
                  </div>
                  {!isValid && !errorMessage && (
                    <p
                      id="desktop-email-error"
                      className="mt-1 text-sm text-red-200"
                    >
                      Please enter a valid email address
                    </p>
                  )}
                  {errorMessage && (
                    <p
                      className={`mt-1 text-sm ${
                        isDuplicate ? "text-yellow-200" : "text-red-200"
                      }`}
                    >
                      {errorMessage}
                    </p>
                  )}
                  {isSubmitted && !errorMessage && (
                    <p className="mt-1 text-sm text-green-200">
                      Thank you for subscribing!
                    </p>
                  )}
                </form>
              </div>
            </div>
            {/* Get to Know Us */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Get to Know Us</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    About Enterprise Journey
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Help Centre
                  </a>
                </li>
                <li>
                  <a
                    href="/discover-abudhabi"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Discover Abu Dhabi
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            {/* For You */}
            <div>
              <h3 className="font-semibold text-lg mb-6">For You</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/marketplace/financial"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Financial Services
                  </a>
                </li>
                <li>
                  <a
                    href="/marketplace/non-financial"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Business Services Hub
                  </a>
                </li>
                <li>
                  <a
                    href="https://ujs.qxk.mybluehost.me/website_e550b4e3/"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Business Communities
                  </a>
                </li>
                <li>
                  <a
                    href="/marketplace/knowledge-hub"
                    className="text-blue-100 hover:text-white transition-colors text-sm"
                  >
                    Knowledge Hub
                  </a>
                </li>
              </ul>
            </div>
            {/* Find Us */}
            <div>
              <h3 className="font-semibold text-lg mb-6">Find Us</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                    <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                    <ExternalLink size={14} />
                  </a>
                </li>
                <li>
                  <a
                    href="/coming-soon"
                    className="text-blue-100 hover:text-white transition-colors text-sm flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                    <ExternalLink size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Copyright - Desktop */}
          <div className="border-t border-blue-500 pt-6 flex items-center justify-between">
            <p className="text-blue-100 text-sm">
              © 2025 Enterprise Journey. All rights reserved.
            </p>
            <p className="text-blue-100 text-sm">v2.1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
