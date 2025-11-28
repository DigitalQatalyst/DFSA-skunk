import { BusinessProfile } from "../../../components/BusinessProfile/BusinessProfile";
import { useAuth } from "../../../components/Header";
import { isDemoModeEnabled, getDemoUser } from "../../../utils/demoAuthUtils";

const BusinessProfilePage = () => {
  const { user, isLoading } = useAuth();

  // In demo mode, use the demo user
  const effectiveUser = isDemoModeEnabled() ? getDemoUser() : user;
  const effectiveLoading = isDemoModeEnabled() ? false : isLoading;

  // Show loading state while authentication is being determined
  if (effectiveLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If no user is authenticated, show an error message
  if (!effectiveUser || !effectiveUser.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Authentication Required
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please log in to view your profile information.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use the authenticated user's ID as the Azure ID
  return <BusinessProfile activeSection={"profile"} azureId={effectiveUser.id} />;
};

export default BusinessProfilePage;
