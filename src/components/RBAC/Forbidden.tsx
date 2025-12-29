/**
 * Forbidden Component
 *
 * Displays a consistent "Access Denied" message when user lacks permissions
 */

import React from "react";
import { AlertCircle, Lock, LogOut } from "lucide-react";
import { useAuth } from "../../components/Header/context/AuthContext";

interface ForbiddenProps {
  message?: string;
  showBackButton?: boolean;
}

/**
 * Logout Button Component
 */
function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout & Switch Account
    </button>
  );
}

/**
 * Forbidden component displayed when user lacks required permissions
 */
export function Forbidden({
  message = "You do not have permission to access this resource.",
  showBackButton = true,
}: ForbiddenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-4">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>

        <div className="flex items-start justify-center mb-6">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {showBackButton && (
          <div className="space-y-3">
            <LogoutButton />
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
