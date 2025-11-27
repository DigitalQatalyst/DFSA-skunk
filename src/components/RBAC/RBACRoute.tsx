import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAbility } from "@casl/react";
import { CASLAbilityContext, useAbilityContext } from "../../context/AbilityContext";
import {
  Actions,
  AppAbility,
  getRoutePermission,
  isRouteProtected,
  Subjects,
} from "../../config/abilities";
import { useAuth } from "../../components/Header";
import { Forbidden } from "./Forbidden";
import { logRoleDebug } from "../../services/roleMapper";

interface RBACRouteProps {
  subject?: Subjects;
  action?: Actions;
  fallbackElement?: React.ReactNode;
  fallbackRedirect?: string;
  requireAuth?: boolean;
  children: React.ReactNode;
}

/**
 * RBACRoute - Route guard component that enforces CASL permissions for routes.
 *
 * This component combines authentication and authorization checks. It can be used
 * as a wrapper around route content or as a route element in React Router.
 *
 * Behavior:
 * - Ensures authentication (unless requireAuth is false)
 * - Resolves permission via explicit subject/action props or via getRoutePermission(path)
 * - If no mapping is found and the path is under a protected prefix, denies by default
 * - Uses CASL ability from CASLAbilityContext and checks ability.can(action, subject)
 *
 * @example
 * // Usage in React Router Route element prop
 * <Route
 *   path="/admin-ui/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <RBACRoute>
 *         <AdminDashboard />
 *       </RBACRoute>
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // With explicit permission override
 * <RBACRoute subject="admin-dashboard" action="read">
 *   <AdminDashboard />
 * </RBACRoute>
 *
 * @example
 * // Public route (no auth required)
 * <RBACRoute requireAuth={false}>
 *   <PublicPage />
 * </RBACRoute>
 */

export function RBACRoute({
  subject: explicitSubject,
  action: explicitAction,
  fallbackElement,
  requireAuth = true,
  children,
}: RBACRouteProps) {
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const { role, isRoleLoading } = useAbilityContext();

  useEffect(() => {
    logRoleDebug(role ?? "runtime:RBACRoute", role, "RBACRoute");
  }, [role]);

  // Show loading state while auth or role is being determined
  if (authLoading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If ability is not yet ready (shouldn't happen but safety check)
  if (!ability) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  // Determine required permission: explicit override takes precedence
  const routePermission =
    explicitSubject && explicitAction
      ? { subject: explicitSubject, action: explicitAction }
      : getRoutePermission(location.pathname);

  // No permission mapping found
  if (!routePermission) {
    // If the route is not under protected prefixes, allow through
    if (!isRouteProtected(location.pathname)) {
      return <>{children}</>;
    }
    // Deny-by-default for protected prefixes without explicit permission mapping
    return (
      <>
        {fallbackElement ?? (
          <Forbidden
            message={`Access denied. This route requires permissions that are not configured.`}
          />
        )}
      </>
    );
  }

  // Check CASL permission
  const allowed = ability.can(routePermission.action, routePermission.subject);

  if (allowed) {
    return <>{children}</>;
  }

  // Not allowed: show provided fallback, Forbidden component, or redirect
  if (fallbackElement) {
    return <>{fallbackElement}</>;
  }

  // Check if user has unknown/undefined role
  if (!role) {
    // Unknown role - show specific message
    return (
      <Forbidden message="Access denied. Your account role is not recognized. Please contact support." />
    );
  }

  // Use Forbidden component for better UX
  return (
    <Forbidden
      message={`You do not have permission to ${routePermission.action} ${routePermission.subject}.`}
    />
  );
}

export default RBACRoute;
