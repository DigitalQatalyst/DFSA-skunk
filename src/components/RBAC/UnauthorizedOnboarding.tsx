/**
 * Unauthorized Onboarding Component
 *
 * Displays a user-friendly message when a viewer or non-admin user
 * tries to access the onboarding form.
 */

import { Lock, Shield, ArrowLeft, Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAbilityContext } from "../../context/AbilityContext";
import { useAuth } from "../../components/Header/context/AuthContext";

interface UnauthorizedOnboardingProps {
  message?: string;
}

/**
 * UnauthorizedOnboarding component displayed when non-admin users try to access onboarding
 */
export function UnauthorizedOnboarding({
  message,
}: UnauthorizedOnboardingProps) {
  const { role } = useAbilityContext();
  const { logout } = useAuth();

  const defaultMessage =
    role === "viewer" || !role
      ? "The onboarding form is only available to administrators. Please contact your administrator if you need to complete onboarding."
      : "You do not have permission to access the onboarding form. Only administrators can complete onboarding.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Access Restricted
        </h1>

        {/* Message */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {message || defaultMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Role Information */}
        {role && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-medium">Your current role:</span>{" "}
              <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-gray-800 font-semibold capitalize">
                {role}
              </span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={logout}
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout & Switch Account
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            If you believe you should have access to this feature, please
            contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
