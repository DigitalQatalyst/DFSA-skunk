import { useEffect, useState } from "react";
import { ExploreDropdown } from "./components/ExploreDropdown";
import { MobileDrawer } from "./components/MobileDrawer";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationsMenu } from "./notifications/NotificationsMenu";
import { NotificationCenter } from "./notifications/NotificationCenter";
import { mockNotifications } from "./utils/mockNotifications";
import { useAuth } from "./context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import EnquiryModal from "../EnquiryModal";
import { OnboardingModal } from "./components/OnboardingModal";
import { SignInModal } from "./components/SignInModal";
import { SignupModal } from "./components/SignupModal";
import { DFSAEnquirySignupModal } from "./components/DFSAEnquirySignupModal";
import { getStoredSignUpData } from "../../pages/dashboard/onboarding/dfsa/hooks/usePrePopulation";

interface HeaderProps {
  toggleSidebar?: () => void;
  sidebarOpen?: boolean;
  showSidebarToggle?: boolean;
  "data-id"?: string;
}

export function Header({
  toggleSidebar,
  sidebarOpen,
  showSidebarToggle = false,
  "data-id": dataId,
}: HeaderProps) {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isDFSAEnquiryModalOpen, setIsDFSAEnquiryModalOpen] = useState(false);
  const [signupUsername, setSignupUsername] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Count unread notifications
  const unreadCount = mockNotifications.filter((notif) => !notif.read).length;

  // Load sign-up username from localStorage
  useEffect(() => {
    const signUpData = getStoredSignUpData();
    if (signUpData?.contactName) {
      setSignupUsername(signUpData.contactName);
    }
  }, []);

  // Sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle notifications menu
  const toggleNotificationsMenu = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    if (showNotificationCenter) setShowNotificationCenter(false);
  };

  // Open notification center
  const openNotificationCenter = () => {
    setShowNotificationCenter(true);
    setShowNotificationsMenu(false);
  };

  // Close notification center
  const closeNotificationCenter = () => {
    setShowNotificationCenter(false);
  };

  // Handle sign in - now opens dedicated sign in modal
  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  const handleSignUp = () => {
    // Always show DFSA Enquiry modal for Sign Up
    setIsDFSAEnquiryModalOpen(true);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    console.log("Onboarding completed");
    // You can integrate with your auth system here
    // The modal will be closed by the OnboardingModal component
  };

  // Toggle enquiry modal
  const toggleEnquiryModal = () => {
    setIsEnquiryModalOpen(!isEnquiryModalOpen);
  };

  // Close enquiry modal
  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  // Reset notification states when user logs out
  useEffect(() => {
    if (!user) {
      setShowNotificationsMenu(false);
      setShowNotificationCenter(false);
    }
  }, [user]);

  // Smooth scroll to partner CTA
  const scrollToPartner = () => {
    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash: "#partner" });
      return;
    }
    if (window.location.hash !== "#partner") {
      window.location.hash = "#partner";
    }
    const el =
      document.getElementById("cta-partner") ||
      document.getElementById("contact");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header
        className={`flex items-center w-full transition-all duration-300 ${isSticky
          ? "fixed top-0 left-0 right-0 z-40 shadow-lg backdrop-blur-sm"
          : "relative shadow-sm"
          }`}
        style={{
          background: isSticky
            ? 'linear-gradient(to right, rgba(184, 41, 51, 0.95), rgba(184, 41, 51, 0.85) 60%, rgba(163, 145, 67, 0.95))'
            : 'linear-gradient(to right, #b82933, #b82933 60%, #a39143)'
        }}
        data-id={dataId}
      >
        {/* Logo Section */}
        <Link
          to="/"
          className={`py-2 px-4 flex items-center transition-all duration-300 ${isSticky ? "h-12" : "h-16"
            }`}
        >
          <img
            src="/logo/dfsa-logo-white.png"
            alt="DFSA Logo"
            className={`transition-all duration-300 ${isSticky ? "h-8" : "h-10"
              }`}
          />
        </Link>
        {/* Main Navigation */}
        <div
          className={`flex-1 flex justify-between items-center text-gray-800 px-4 transition-all duration-300 ${isSticky ? "h-12" : "h-16"
            }`}
        >
          {/* Left side: tablet sidebar hamburger + nav */}
          <div className="flex items-center">
            {showSidebarToggle && toggleSidebar && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden"
                aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={sidebarOpen ?? false}
              >
                <Menu size={20} />
              </button>
            )}
            {/* Left Navigation - Desktop and Tablet */}
            <div className="hidden md:flex items-center space-x-8 ml-4">
              <ExploreDropdown isCompact={isSticky} />
              <button
                className="transition-colors duration-200 font-medium hover:opacity-80"
                style={{ color: '#ffffff' }}
                onClick={() => console.log('Explore DIFCA clicked')}
              >
                Explore DIFC
              </button>
            </div>
          </div>
          {/* Right Side - Conditional based on auth state and screen size */}
          <div className="flex items-center ml-auto relative">
            {user ? (
              <ProfileDropdown
                onViewNotifications={toggleNotificationsMenu}
                unreadNotifications={unreadCount}
              />
            ) : (
              <>
                {/* Desktop CTAs (≥1024px) */}
                <div className="hidden lg:flex items-center space-x-3">
                  {signupUsername ? (
                    <div
                      className={`px-4 py-2 text-white font-semibold border-2 border-white rounded-md ${isSticky ? "text-sm px-3 py-1.5" : ""}`}
                    >
                      Hi, {signupUsername}
                    </div>
                  ) : (
                    <button
                      className={`px-4 py-2 bg-transparent border-2 border-white rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 font-semibold ${isSticky ? "text-sm px-3 py-1.5" : ""
                        }`}
                      style={{ color: '#ffffff' }}
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  )}
                </div>
                {/* Tablet Sign Up Button (768px - 1023px) */}
                <div className="hidden md:flex lg:hidden items-center">
                  {signupUsername ? (
                    <div
                      className={`px-3 py-2 text-white font-semibold border-2 border-white rounded-md ${isSticky ? "text-sm px-2 py-1.5" : "text-sm"}`}
                    >
                      Hi, {signupUsername}
                    </div>
                  ) : (
                    <button
                      className={`px-3 py-2 bg-transparent border-2 border-white rounded-md hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 font-semibold ${isSticky ? "text-sm px-2 py-1.5" : "text-sm"
                        }`}
                      style={{ color: '#ffffff' }}
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  )}
                </div>
              </>
            )}
            {/* Mobile and Tablet Drawer - Show for screens <1024px */}
            <MobileDrawer
              isCompact={isSticky}
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              isSignedIn={!!user}
              onEnquiry={toggleEnquiryModal}
              onPartner={scrollToPartner}
            />
          </div>
        </div>
      </header>
      {/* Spacer for sticky header */}
      {isSticky && <div className="h-12"></div>}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={closeEnquiryModal}
        data-id="enquiry-modal"
      />

      {/* Onboarding Modal - still used on /onboarding page */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSignInSuccess={() => {
          console.log('Sign in successful');
        }}
        onSwitchToSignUp={() => {
          setIsSignInModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />

      {/* Sign Up Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSignupSuccess={(data) => {
          console.log('Signup successful:', data);
        }}
        onSwitchToSignIn={() => {
          setIsSignupModalOpen(false);
          setIsSignInModalOpen(true);
        }}
      />

      {/* DFSA Enquiry Sign-Up Modal */}
      <DFSAEnquirySignupModal
        isOpen={isDFSAEnquiryModalOpen}
        onClose={() => setIsDFSAEnquiryModalOpen(false)}
        onSuccess={(referenceNumber) => {
          console.log('DFSA Enquiry submitted:', referenceNumber);
          // Optional: Navigate to dashboard or confirmation page
        }}
      />

      {/* Notifications Menu */}
      {showNotificationsMenu && user && (
        <NotificationsMenu
          onViewAll={openNotificationCenter}
          onClose={() => setShowNotificationsMenu(false)}
        />
      )}
      {/* Notification Center Modal */}
      {showNotificationCenter && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeNotificationCenter}
          ></div>
          <div className="relative bg-white shadow-xl rounded-lg max-w-2xl w-full max-h-[90vh] m-4 transform transition-all duration-300">
            <NotificationCenter onBack={closeNotificationCenter} />
          </div>
        </div>
      )}
    </>
  );
}
