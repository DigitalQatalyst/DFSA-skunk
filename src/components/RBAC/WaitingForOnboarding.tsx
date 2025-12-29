/**
 * Waiting For Onboarding Component
 * 
 * Displays a message for non-admin users who need to wait
 * for an admin to complete onboarding before accessing the dashboard.
 */


import { Clock, Shield, UserCheck } from 'lucide-react';
import { useAbilityContext } from '../../context/AbilityContext';

/**
 * WaitingForOnboarding component displayed when onboarding is incomplete
 * and user is not an admin (cannot complete onboarding themselves)
 */
export function WaitingForOnboarding() {
  const { role } = useAbilityContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 md:p-12">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-100 p-6">
            <Clock className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Onboarding Required
        </h1>

        {/* Message */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-md">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">
                Your account setup is not yet complete. An administrator needs to complete the onboarding process before you can access the dashboard.
              </p>
              <p className="text-gray-600 text-sm">
                Please contact your system administrator to complete onboarding for your account.
              </p>
            </div>
          </div>
        </div>

        {/* Role Information */}
        {role && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Your role:</span>{' '}
                <span className="inline-block px-3 py-1 bg-gray-200 rounded-full text-gray-800 font-semibold capitalize">
                  {role}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Once onboarding is completed by an administrator, you will be able to access all dashboard features.
          </p>
        </div>
      </div>
    </div>
  );
}


