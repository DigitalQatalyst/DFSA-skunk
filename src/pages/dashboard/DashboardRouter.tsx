import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { DocumentsPage } from "./documents";
import { Overview } from "./overview";
import { ServiceRequestsPage } from "./serviceRequests";

import { OnboardingForm } from "./onboarding/OnboardingForm";
import { ReportsPage } from "./reportingObligations/ReportsPage";
import { AllReceivedReportsPage } from "./reportingObligations/AllReceivedReportsPage";
import { AllSubmittedReportsPage } from "./reportingObligations/AllSubmittedReportsPage";
import { AllUpcomingObligationsPage } from "./reportingObligations/AllUpcomingObligationsPage";
import BusinessProfilePage from "./businessProfile";
import SupportPage from "./support";
import SettingsPage from "./settings";
import { ChatInterface } from "../../components/Chat/ChatInterface";
import { RBACRoute } from "../../components/RBAC/RBACRoute";
import { HelpCenterPage } from "../../components/HelpCenter/HelpCenterPage";
import { ContentForm } from "../../components/HelpCenter/Content/ContentForm";
import { useAuth } from "../../components/Header";
import { useUnifiedAuthFlow } from "../../hooks/useUnifiedAuthFlow";
import {
  invalidateOnboardingStatus,
  setOnboardingStatusCache,
} from "../../hooks/useOnboardingStatus";
import { isDemoModeEnabled } from "../../utils/demoAuthUtils";

// Form imports
import BookConsultationForEntrepreneurship from "../forms/BookConsultationForEntrepreneurship";
import CancelLoan from "../forms/CancelLoan";
import DisburseApprovedLoan from "../forms/DisburseApprovedLoan";
import FacilitateCommunication from "../forms/FacilitateCommunication";
import IssueSupportLetter from "../forms/IssueSupportLetter";
import NeedsAssessmentForm from "../forms/NeedsAssessmentForm";
import ReallocationOfLoanDisbursement from "../forms/ReallocationOfLoanDisbursement";
import RequestForFunding from "../forms/RequestForFunding";
import RequestForMembership from "../forms/RequestForMembership";
import RequestToAmendExistingLoanDetails from "../forms/RequestToAmendExistingLoanDetails";
import TrainingInEntrepreneurship from "../forms/TrainingInEntrepreneurship";
import CollateralUserGuide from "../forms/CollateralUserGuide";
import EJPEnterpriseOperationsInsightDashboard from "../../modules/ejp-enterprise-operations-insight";
import EJPOperationsDashboard from "../../modules/service-delivery-overview";

// Main Dashboard Router Component
const DashboardRouter = () => {
  // Note: Onboarding checks and routing are now handled by ProtectedRoute
  // via useUnifiedAuthFlow hook, so we don't need duplicate checks here
  const [, setIsOpen] = useState<boolean>(() => {
    try {
      if (typeof globalThis.window !== "undefined") {
        return globalThis.window.innerWidth >= 1024; // lg and up open by default
      }
    } catch {
      console.log("Error in catch");
    }
    return true;
  });
  const { user } = useAuth();
  const isLoggedIn = isDemoModeEnabled() ? true : Boolean(user);
  const location = useLocation();
  const navigate = useNavigate();
  // Use unified auth flow for onboarding state - ProtectedRoute already handles checks and routing
  const { onboardingState, refetchOnboarding, organization } =
    useUnifiedAuthFlow();

  // Keep sidebar hidden on tablet/mobile by default; open on desktop
  useEffect(() => {
    const onResize = () => {
      if (globalThis.window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    globalThis.window.addEventListener("resize", onResize);
    return () => globalThis.window.removeEventListener("resize", onResize);
  }, []);

  // Handle onboarding completion - refetch onboarding status and navigate
  const handleOnboardingComplete = async () => {
    console.log(
      "🎉 Onboarding completed - refetching status and navigating to overview"
    );

    // Optimistically update cache to 'completed' for immediate UI feedback
    const accountId = organization?.accountId;
    if (accountId) {
      setOnboardingStatusCache(accountId, "completed");
    }

    // Invalidate and refetch onboarding status to ensure consistency
    if (accountId) {
      invalidateOnboardingStatus(accountId);
    }
    await refetchOnboarding();

    // Navigate will be handled by useUnifiedAuthFlow, but we do it here too for immediate feedback
    navigate("/dashboard/overview", { replace: true });
  };

  const onboardingComplete = onboardingState === "completed";

  // Show normal dashboard - ProtectedRoute already handles onboarding checks and routing
  return (
    <DashboardLayout
      onboardingComplete={onboardingComplete}
      setOnboardingComplete={() => {}} // No-op since we use unified flow
      isLoggedIn={isLoggedIn}
    >
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route
          path="onboarding"
          element={
            // Non-admins are already redirected in ProtectedRoute - this will only render for admins
            <OnboardingForm
              onComplete={handleOnboardingComplete}
              isRevisit={onboardingComplete}
            />
          }
        />
        {/* Dashboard routes wrapped with RBACRoute for permission checking */}
        {/* RBACRoute automatically resolves permissions via getRoutePermission() from routePermissions mapping */}
        <Route
          path="overview"
          element={
            <RBACRoute>
              <Overview setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />
            </RBACRoute>
          }
        />
        <Route
          path="documents"
          element={
            <RBACRoute>
              <DocumentsPage />
            </RBACRoute>
          }
        />
        <Route
          path="requests"
          element={
            <RBACRoute>
              <ServiceRequestsPage />
            </RBACRoute>
          }
        />
        <Route
          path="reporting"
          element={<Navigate to="reporting-obligations" replace />}
        />
        <Route
          path="reporting-obligations"
          element={
            <RBACRoute>
              <ReportsPage setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />
            </RBACRoute>
          }
        />
        <Route
          path="reporting-obligations/obligations"
          element={
            <RBACRoute>
              <AllUpcomingObligationsPage />
            </RBACRoute>
          }
        />
        <Route
          path="reporting-obligations/submitted"
          element={
            <RBACRoute>
              <AllSubmittedReportsPage />
            </RBACRoute>
          }
        />
        <Route
          path="reporting-obligations/received"
          element={
            <RBACRoute>
              <AllReceivedReportsPage />
            </RBACRoute>
          }
        />
        <Route
          path="profile"
          element={
            <RBACRoute>
              <BusinessProfilePage />
            </RBACRoute>
          }
        />
        <Route
          path="settings"
          element={
            <RBACRoute>
              <SettingsPage setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />
            </RBACRoute>
          }
        />
        <Route
          path="support"
          element={
            <RBACRoute>
              <SupportPage setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />
            </RBACRoute>
          }
        />
        <Route
          path="chat-support"
          element={
            <RBACRoute>
              <ChatInterface setIsOpen={setIsOpen} isLoggedIn={isLoggedIn} />
            </RBACRoute>
          }
        />
        <Route
          path="help-center"
          element={
            <RBACRoute>
              <HelpCenterPage />
            </RBACRoute>
          }
        />
        <Route
          path="content-form"
          element={
            <RBACRoute>
              <ContentForm />
            </RBACRoute>
          }
        />

        {/* Forms Routes - wrapped with RBACRoute for permission checking */}
        <Route
          path="forms/book-consultation-for-entrepreneurship"
          element={
            <RBACRoute>
              <BookConsultationForEntrepreneurship />
            </RBACRoute>
          }
        />
        <Route
          path="forms/cancel-loan"
          element={
            <RBACRoute>
              <CancelLoan />
            </RBACRoute>
          }
        />
        <Route
          path="forms/collateral-user-guide"
          element={
            <RBACRoute>
              <CollateralUserGuide />
            </RBACRoute>
          }
        />
        <Route
          path="forms/disburse-approved-loan"
          element={
            <RBACRoute>
              <DisburseApprovedLoan />
            </RBACRoute>
          }
        />
        <Route
          path="forms/facilitate-communication"
          element={
            <RBACRoute>
              <FacilitateCommunication />
            </RBACRoute>
          }
        />
        <Route
          path="forms/issue-support-letter"
          element={
            <RBACRoute>
              <IssueSupportLetter />
            </RBACRoute>
          }
        />
        <Route
          path="forms/needs-assessment-form"
          element={
            <RBACRoute>
              <NeedsAssessmentForm />
            </RBACRoute>
          }
        />
        <Route
          path="forms/reallocation-of-loan-disbursement"
          element={
            <RBACRoute>
              <ReallocationOfLoanDisbursement />
            </RBACRoute>
          }
        />
        <Route
          path="forms/request-for-funding"
          element={
            <RBACRoute>
              <RequestForFunding />
            </RBACRoute>
          }
        />
        <Route
          path="forms/request-for-membership"
          element={
            <RBACRoute>
              <RequestForMembership />
            </RBACRoute>
          }
        />
        <Route
          path="forms/request-to-amend-existing-loan-details"
          element={
            <RBACRoute>
              <RequestToAmendExistingLoanDetails />
            </RBACRoute>
          }
        />
        <Route
          path="forms/training-in-entrepreneurship"
          element={
            <RBACRoute>
              <TrainingInEntrepreneurship />
            </RBACRoute>
          }
        />

        {/* Analytics Routes */}
        <Route
          path="experience-analytics"
          element={
            <RBACRoute>
              <EJPEnterpriseOperationsInsightDashboard />
            </RBACRoute>
          }
        />
        <Route
          path="experience-analytics/enterprise-operations"
          element={
            <RBACRoute>
              <EJPEnterpriseOperationsInsightDashboard />
            </RBACRoute>
          }
        />
        <Route
          path="experience-analytics/service-delivery"
          element={
            <RBACRoute>
              <EJPOperationsDashboard />
            </RBACRoute>
          }
        />

        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;
