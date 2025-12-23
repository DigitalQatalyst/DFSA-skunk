import React, { useMemo, useState } from "react";
import {
  PageLayout,
  PageSection,
  SectionHeader,
  SectionContent,
  PrimaryButton,
} from "../../../components/PageLayout";
import { NotificationCenter } from "../../../components/Header";
import { DashboardErrorBoundary } from "../../../components/ErrorBoundary";
import { OnboardingProgress } from "./OnboardingProgress";
import { MetricsOverview } from "./MetricsOverview";
import { ServiceRequestsTable } from "./ServiceRequestsTable";
import { ObligationsDeadlines } from "./ObligationsDeadlines";
import { QuickActions } from "./QuickActions";
import { Announcements } from "./Announcements";
import { useProfileData } from "../../../hooks/useProfileData";
import { useDocumentCompletion } from "../../../hooks/useDocumentCompletion";
import { useReportingObligations } from "../../../hooks/useReportingObligations";
import { useAuth } from "../../../components/Header";
import { checkMandatoryFieldsCompletion } from "../../../utils/config";
export const Overview: React.FC<{
  setIsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
}> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Get authenticated user
  const { user, organizationInfo } = useAuth();

  // Get live profile data and compute mandatory completion identically to BusinessProfile
  const { profileData, loading: profileLoading } = useProfileData(user?.id);
  const mandatoryCompletion = useMemo(() => {
    if (!profileData || !profileData.companyStage) return 0;
    const res = checkMandatoryFieldsCompletion(profileData, profileData.companyStage);
    return res.total > 0 ? Math.round((res.completed / res.total) * 100) : 0;
  }, [profileData]);
  // Get dynamic document completion data
  const {
    documentCompletion,
    loading: documentLoading
  } = useDocumentCompletion(user?.id);

  // Get reporting obligations (limit to 3 for overview)
  const {
    obligations,
    loading: obligationsLoading,
    error: obligationsError,
  } = useReportingObligations(3);

  // Calculate combined completion (weighted average: 70% profile, 30% documents)
  const combinedCompletion = Math.round((mandatoryCompletion * 0.7) + (documentCompletion * 0.3));

  // Determine if onboarding is complete (80% threshold)
  const isOnboardingComplete = combinedCompletion >= 80;

  const onboardingData = {
    profileCompletion: mandatoryCompletion,
    documentCompletion,
    overallCompletion: combinedCompletion,
  };
  // Handle retry if data loading fails
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  // NOTE: handleNewRequest removed because it wasn't used in this component

  // Handle view all announcements click
  const handleViewAllAnnouncements = () => {
    setShowNotificationCenter(true);
  };

  // Close notification center
  const closeNotificationCenter = () => {
    setShowNotificationCenter(false);
  };
  if (hasError) {
    return (
      <PageLayout
        title="Dashboard Overview"
        breadcrumbs={[{ label: "Dashboard", current: true }]}
      >
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-bold font-primary text-primary mb-4">
            Unable to load dashboard data
          </h3>
          <p className="text-dfsa-gray mb-6">
            We encountered an issue while loading your dashboard. Please try
            again.
          </p>
          <PrimaryButton onClick={handleRetry}>Retry</PrimaryButton>
        </div>
      </PageLayout>
    );
  }
  return (
    <DashboardErrorBoundary>
      <PageLayout
        title="Dashboard Overview"
        breadcrumbs={[{ label: "Dashboard", current: true }]}
      >
        {/* New Dashboard Layout Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-7">
          {/* Left Column - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Setup Card or Metrics Card (conditional based on 80% completion) */}
            {!isOnboardingComplete ? (
              <PageSection>
                <OnboardingProgress
                  profileCompletion={onboardingData.profileCompletion}
                  documentCompletion={onboardingData.documentCompletion}
                  overallCompletion={onboardingData.overallCompletion}
                  isLoading={isLoading || profileLoading || documentLoading}
                  ctaUrl="/dashboard/profile"
                />
              </PageSection>
            ) : (
              <PageSection>
                <SectionHeader title="Overview of your Business Performance Indicators"
                  description="An insight into the essential metrics that measure your business's success and growth."
                  headerClassName="border-b border-primary/10 p-6 flex justify-between items-center"
                  titleClassName="text-lg font-bold font-primary text-primary m-0">

                </SectionHeader>
                <SectionContent>
                  <MetricsOverview
                    isLoading={isLoading}
                    enterpriseId={organizationInfo?.organization?.kf_accountid}
                  />
                </SectionContent>
              </PageSection>
            )}
            {/* Obligations & Deadlines */}
            <PageSection>
              <SectionHeader title="Track Important Deadlines and Required Actions"
                description="Stay on top of key compliance dates and complete important business obligations on time."
                headerClassName="border-b border-primary/10 p-6 flex justify-between items-center"
                titleClassName="text-lg font-bold font-primary text-primary m-0">
              </SectionHeader>
              <SectionContent>
                <ObligationsDeadlines
                  isLoading={obligationsLoading}
                  obligations={obligations}
                  error={obligationsError}
                />
              </SectionContent>
            </PageSection>
            {/* Service Requests Table */}
            <PageSection>
              <SectionHeader title="View and Manage Your Recent Service Requests"
                description="Easily track the status of your service requests and take action as needed."
                headerClassName="border-b border-primary/10 p-6 flex justify-between items-center"
                titleClassName="text-lg font-bold font-primary text-primary m-0">
              </SectionHeader>
              <SectionContent>
                <ServiceRequestsTable isLoading={isLoading} />
              </SectionContent>
            </PageSection>
          </div>
          {/* Right Column - 1/3 width on desktop */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <PageSection>


              <SectionHeader title="Common Tasks and Shortcuts for Your Business"
                description="Quickly access frequently used features like creating requests, uploading documents, or contacting support."
                headerClassName="border-b border-primary/10 p-6 flex justify-between items-center"
                titleClassName="text-lg font-bold font-primary text-primary m-0" >

              </SectionHeader>
              <SectionContent>
                <QuickActions />
              </SectionContent>
            </PageSection>
            {/* Announcements - Taller to match combined height */}
            <PageSection className="lg:flex-grow">
              <SectionHeader title="Important Updates and Notifications"
                description="View the latest platform updates, funding opportunities, and maintenance announcements relevant to your business."
                headerClassName="border-b border-primary/10 p-6 flex justify-between items-center"
                titleClassName="text-lg font-bold font-primary text-primary m-0">

              </SectionHeader>
              <SectionContent>
                <Announcements
                  isLoading={isLoading}
                  onViewAllClick={handleViewAllAnnouncements}
                />
              </SectionContent>
            </PageSection>
          </div>
        </div>

        {/* Notification Center Modal */}
        {showNotificationCenter && (
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
      </PageLayout>
    </DashboardErrorBoundary>
  );
};
