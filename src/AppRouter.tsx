import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CourseType } from "./utils/mockData";
import { AuthProvider as MsalAuthProvider } from "./components/Header";
import { UnifiedAuthProvider } from "./context/UnifiedAuthProvider";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { App } from "./App";
import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";
import { RBACRoute } from "./components/RBAC/RBACRoute";
import { AbilityProvider } from "./context/AbilityContext";
import {DiscoverAbuDhabi} from "./pages/discoverAbuDhabi";
import NotFound from "./pages/NotFound";
import MediaDetailPage from "./pages/media/MediaDetailPage";
import KfBot from "./bot/KfBot";
import SchemaBasedServiceRequestForm from "./pages/forms/SchemaBasedServiceRequestForm";
import TestSchemas from "./pages/TestSchemas";


import NeedsAssessmentForm from "./pages/forms/NeedsAssessmentForm";
import RequestForMembership from "./pages/forms/RequestForMembership";
import RequestForFunding from "./pages/forms/RequestForFunding";
import BookConsultationForEntrepreneurship from "./pages/forms/BookConsultationForEntrepreneurship";
import CancelLoan from "./pages/forms/CancelLoan";
import CollateralUserGuide from "./pages/forms/CollateralUserGuide";
import DisburseApprovedLoan from "./pages/forms/DisburseApprovedLoan";
import FacilitateCommunication from "./pages/forms/FacilitateCommunication";
import ReallocationOfLoanDisbursement from "./pages/forms/ReallocationOfLoanDisbursement";
import RequestToAmendExistingLoanDetails from "./pages/forms/RequestToAmendExistingLoanDetails";
import TrainingInEntrepreneurship from "./pages/forms/TrainingInEntrepreneurship";
import IssueSupportLetter from "./pages/forms/IssueSupportLetter";
import { FormLayoutWrapper } from "./components/Forms/FormLayoutWrapper";
import GrowthAreasMarketplace from "./pages/GrowthAreasMarketplace";
import GrowthAreasPage from "./pages/GrowthAreasPage";
import BusinessDirectoryMarketplace from "./pages/BusinessDirectoryMarketplace";
import {ComingSoon} from "./pages/ComingSoon";
import WomenEntrepreneursHub from "./pages/WomenEntrepreneursHub";
// Event details page
import { EventDetailsPage } from "./pages/media/EventDetailsPage";
import Communities from "./pages/communities/Communities";
import CreateCommunity from "./pages/communities/CreateCommunity";
import Home from "./pages/communities/Home";
import CommunityFeed from "./pages/communities/CommunityFeed";
import Community from "./pages/communities/Community";
import CommunityMembers from "./pages/communities/CommunityMembers";
import CommunitySettings from "./pages/communities/CommunitySettings";
import CommunityAnalytics from "./pages/communities/CommunityAnalytics";
import ModerationDashboard from "./pages/ModerationDashboard";
import MessagingDashboard from "./pages/MessagingDashboard";
import ActivityCenter from "./pages/ActivityCenter";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import ProfileDashboard from "./pages/ProfileDashboard";
import { Toaster } from "./components/ui/toaster";
import DocumentSelectorTest from "./pages/DocumentSelectorTest";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import EJPEnterpriseOperationsInsightDashboard from "./modules/ejp-enterprise-operations-insight";
import EJPOperationsDashboard from "./modules/service-delivery-overview";

export function AppRouter() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<string[]>([]);
  const [compareCourses, setCompareCourses] = useState<CourseType[]>([]);
  const toggleBookmark = (courseId: string) => {
    setBookmarkedCourses((prev) => {
      if (prev.includes(courseId)) {
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };
  const handleAddToComparison = (course: CourseType) => {
    if (
      compareCourses.length < 3 &&
      !compareCourses.some((c) => c.id === course.id)
    ) {
      setCompareCourses((prev) => [...prev, course]);
    }
  };


  return (
    <BrowserRouter>
      <MsalAuthProvider>
        <UnifiedAuthProvider>
          <AbilityProvider>
          <SidebarProvider>
            <AuthModalProvider>
              <KfBot />
              <Toaster />
              <SonnerToaster />
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/courses" element={<App />} />
                <Route
                  path="/courses/:itemId"
                  element={
                    <MarketplaceDetailsPage
                      marketplaceType="courses"
                      bookmarkedItems={bookmarkedCourses}
                      onToggleBookmark={toggleBookmark}
                      onAddToComparison={handleAddToComparison}
                    />
                  }
                />

                
                <Route path="/marketplace/*" element={<MarketplaceRouter />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <DashboardRouter />
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
              <Route 
                  path="/forms/request-service" 
                  element={
                    // <ProtectedRoute>
                      <SchemaBasedServiceRequestForm />
                    //  </ProtectedRoute>
                  } 
                />

                <Route
                  path="/women-entrepreneurs"
                  element={<WomenEntrepreneursHub />}
                />
                <Route
                  path="/discover-abudhabi"
                  element={<DiscoverAbuDhabi />}
                />
                <Route
                  path="/growth-areas-marketplace"
                  element={<GrowthAreasMarketplace />}
                />
                <Route path="/growth-areas" element={<GrowthAreasPage />} />
                <Route
                  path="/business-directory-marketplace"
                  element={<BusinessDirectoryMarketplace />}
                />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/coming-soon/:feature" element={<ComingSoon />} />
                {/* Documentation routes - redirect to coming soon */}
                <Route
                  path="/documentation"
                  element={<Navigate to="/coming-soon/documentation" replace />}
                />
                <Route
                  path="/documentation/*"
                  element={<Navigate to="/coming-soon/documentation" replace />}
                />
                {/** Forms routes */}
                <Route
                  path="/forms/needs-assessment"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <NeedsAssessmentForm />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/request-for-membership"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <RequestForMembership />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/request-for-funding"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <RequestForFunding />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/book-consultation"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <BookConsultationForEntrepreneurship />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/cancel-loan"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <CancelLoan />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                {/*<Route*/}
                {/*  path="/forms/collateral-user-guide"*/}
                {/*  element={<ProtectedRoute><CollateralUserGuide /></ProtectedRoute>}*/}
                {/*/>*/}
                <Route
                  path="/forms/collateral-user-guide"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <CollateralUserGuide />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/disburse-approved-loan"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <DisburseApprovedLoan />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/facilitate-communication"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <FacilitateCommunication />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/reallocation-of-loan-disbursement"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <ReallocationOfLoanDisbursement />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/request-to-amend-existing-loan-details"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <RequestToAmendExistingLoanDetails />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/training-in-entrepreneurship"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <TrainingInEntrepreneurship />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/forms/issue-support-letter"
                  element={
                    <ProtectedRoute>
                      <RBACRoute>
                        <FormLayoutWrapper>
                          <IssueSupportLetter />
                        </FormLayoutWrapper>
                      </RBACRoute>
                    </ProtectedRoute>
                  }
                />
                <Route path="/media/:type/:id" element={<MediaDetailPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/404" element={<NotFound />} />
                {/* Community Marketplace*/}
                <Route path="/community" element={<Home />} />
                <Route path="/communities" element={<Communities />} />
                <Route path="/create-community" element={<CreateCommunity />} />
                <Route path="/community/:id" element={<Community />} />
                <Route path="/feed" element={<CommunityFeed />} />
                <Route
                  path="/community/:id/members"
                  element={<CommunityMembers />}
                />
                <Route
                  path="/community/:id/settings"
                  element={<CommunitySettings />}
                />
                <Route path="/moderation" element={<ModerationDashboard />} />
                <Route path="/analytics" element={<CommunityAnalytics />} />
                <Route path="/activity" element={<ActivityCenter />} />
                <Route path="/messages" element={<MessagingDashboard />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/post/edit/:id" element={<CreatePost />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route
                  path="/profile/:userId?"
                  element={<ProfileDashboard />}
                />

                //Analytics Dashboard
        <Route path="/enterprise-operations-insight" element={<EJPEnterpriseOperationsInsightDashboard />} />
        {/* Service Delivery & Efficiency page - Secondary route */}
        <Route path="/service-delivery-overview" element={<EJPOperationsDashboard />} />

                {/* Test Pages */}
                <Route path="/test/schemas" element={<TestSchemas />} />
                <Route
                  path="/test/document-selector"
                  element={
                    <ProtectedRoute>
                      <DocumentSelectorTest />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </AuthModalProvider>
          </SidebarProvider>
          </AbilityProvider>
        </UnifiedAuthProvider>
      </MsalAuthProvider>
    </BrowserRouter>
  );
}
