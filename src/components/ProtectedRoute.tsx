import { PropsWithChildren, useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useAuth } from "../context/UnifiedAuthProvider";
import { useUnifiedAuthFlow } from "../hooks/useUnifiedAuthFlow";
import { AuthFlowLoader } from "./ui/AuthLoader";
import { useAbilityContext } from "../context/AbilityContext";
import { getRoutePermission, isRouteProtected } from "../config/abilities";
import { useAbility } from "@casl/react";
import { CASLAbilityContext } from "../context/AbilityContext";
import { AppAbility } from "../config/abilities";
import { Forbidden } from "./RBAC/Forbidden";
import { ALLOWED_APP_ROLES, logRoleDebug } from "../services/roleMapper";

/**
 * Guards routes behind MSAL auth. If unauthenticated, triggers login and
 * renders nothing while redirecting. If you prefer redirecting to home
 * instead of auto-login, set `AUTO_LOGIN` to false below.
 */
const AUTO_LOGIN = true;

// Define UserRole type
type UserRole = "admin" | "financial-officer" | "business-advisor" | "user" | "viewer";

interface ProtectedRouteProps extends PropsWithChildren {
  requiredRole?: UserRole;
  requiredFormId?: string;
}

// Helper function to check if user has minimum required role
function hasMinRole(userRole: UserRole | null, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  
  const roleHierarchy: Record<UserRole, number> = {
    "admin": 5,
    "financial-officer": 4,
    "business-advisor": 3,
    "user": 2,
    "viewer": 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Helper function to check form access based on role
function hasFormAccess(formId: string, userRole: UserRole | null): boolean {
  // For now, allow all authenticated users to access forms
  // You can add specific form access rules here
  void formId;
  return userRole !== null;
}

/**
 * ProtectedRoute component with optional RBAC support
 *
 * Usage:
 * - Basic auth: <ProtectedRoute><Component /></ProtectedRoute>
 * - Role-based: <ProtectedRoute requiredRole="admin"><Component /></ProtectedRoute>
 * - Form-based: <ProtectedRoute requiredFormId="request-for-funding"><Component /></ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredFormId,
}) => {
  const { user, isLoading: authLoading, login } = useAuth();
  const { instance } = useMsal();
  const location = useLocation();
  const unifiedFlow = useUnifiedAuthFlow();
  const { role, isRoleLoading } = useAbilityContext(); // Get role from AbilityContext
  const ability = useAbility<AppAbility>(CASLAbilityContext);
  const isRoleAllowed = role ? ALLOWED_APP_ROLES.includes(role) : false;

  useEffect(() => {
    logRoleDebug(role ?? "runtime:ProtectedRoute", role, "ProtectedRoute");
  }, [role]);

  // Get user role from user object or token claims
  // Try multiple sources: user object, token claims, or default to null
  const userRole: UserRole | null = useMemo(() => {
    // Try user object first
    if ((user as any)?.role) {
      return (user as any).role as UserRole;
    }
    if ((user as any)?.roles?.[0]) {
      return (user as any).roles[0] as UserRole;
    }

    // Try to extract from MSAL token claims
    try {
      const account = instance.getActiveAccount();
      if (account?.idTokenClaims) {
        const claims = account.idTokenClaims as any;
        // Common claim names for roles in Azure AD
        const roleClaim =
          claims?.roles?.[0] ||
          claims?.role ||
          claims?.extension_role ||
          claims?.appRole ||
          claims?.extension_Role; // Sometimes with capital R
        if (roleClaim) {
          // Normalize role name to match our UserRole type
          const normalizedRole = roleClaim.toLowerCase().replace(/\s+/g, "-");
          // Map common role variations to our types
          const roleMap: Record<string, UserRole> = {
            admin: "admin",
            administrator: "admin",
            "financial-officer": "financial-officer",
            financialofficer: "financial-officer",
            "business-advisor": "business-advisor",
            businessadvisor: "business-advisor",
            advisor: "business-advisor",
            user: "user",
            member: "user",
            viewer: "viewer",
            readonly: "viewer",
          };
          return roleMap[normalizedRole] || (normalizedRole as UserRole);
        }
      }
    } catch (e) {
      // Ignore errors
      console.debug("Error extracting role from token claims:", e);
    }

    return null;
  }, [user, instance]);

  // Not authenticated: either auto-login or redirect to home
  useEffect(() => {
    if (!authLoading && !user && AUTO_LOGIN) {
      // Kick off MSAL redirect sign-in flow
      // MSAL will remember current URL so user returns to the same route
      login();
    }
  }, [authLoading, user, login]);

  // Show loading state while any checks are in progress
  if (unifiedFlow.isLoading || isRoleLoading) {
    // Determine which stage we're on for better loading message
    let stage: 'auth' | 'organization' | 'onboarding' = 'auth';
    if (!authLoading && unifiedFlow.isLoadingOrg) {
      stage = 'organization';
    } else if (
      !authLoading &&
      !unifiedFlow.isLoadingOrg &&
      unifiedFlow.isCheckingOnboarding
    ) {
      stage = 'onboarding';
    } else if (!authLoading && isRoleLoading) {
      stage = 'organization';
    }
    return <AuthFlowLoader stage={stage} />;
  }

  // Not authenticated
  if (!user) {
    if (AUTO_LOGIN) return <AuthFlowLoader stage="auth" />;
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Note: The base /dashboard route is handled at the router level (AppRouter + DashboardRouter)
  // so we don't need additional redirect logic here.

  if (!role) {
    return (
      <Forbidden message="Access denied. Your account role is not recognized. Please contact support." />
    );
  }

  if (!isRoleAllowed) {
    console.warn(
      `[ProtectedRoute] Unsupported or undefined role encountered: ${role ?? "undefined"}`
    );
    return (
      <Forbidden message="Access denied. Your account role is not recognized. Please contact support." />
    );
  }

  // Early redirect: Non-admins should NEVER see onboarding route
  // This prevents any onboarding UI from rendering for non-admins
  const isOnboardingRoute = location.pathname.startsWith('/dashboard/onboarding');
  const isAdmin = role === 'admin';
  if (!isAdmin && isOnboardingRoute && !unifiedFlow.isLoading) {
    console.log('🚫 [PROTECTED ROUTE] Non-admin user attempting to access onboarding - redirecting to overview');
    console.log('🔐 User:', user?.email || user?.name || 'Unknown');
    console.log('🪪 Role:', role);
    return <Navigate to="/dashboard/overview" replace />;
  }

  // Check if route is protected and user has permission
  // This enforces RBAC for all protected routes
  if (isRouteProtected(location.pathname)) {
    const routePermission = getRoutePermission(location.pathname);
    
    // If route has permission mapping, check CASL ability
    if (routePermission) {
      const hasPermission = ability.can(routePermission.action, routePermission.subject);
      
      if (!hasPermission) {
        // Unknown role or insufficient permissions - show Forbidden
        if (!role) {
          return (
            <Forbidden message="Access denied. Your account role is not recognized. Please contact support." />
          );
        }
        return (
          <Forbidden
            message={`You do not have permission to ${routePermission.action} ${routePermission.subject}.`}
          />
        );
      }
    } else {
      // Protected route without permission mapping - deny by default for unknown roles
      if (!role) {
        return (
          <Forbidden message="Access denied. Your account role is not recognized. Please contact support." />
        );
      }
    }
  }

  // Check role-based access if required (legacy support)
  if (requiredRole) {
    if (!hasMinRole(userRole, requiredRole)) {
      return (
        <Forbidden
          message={`This page requires ${requiredRole} role. Your role: ${userRole || "none"}`}
        />
      );
    }
  }

  // Check form-based access if required (legacy support)
  if (requiredFormId) {
    if (!hasFormAccess(requiredFormId, userRole)) {
      return (
        <Forbidden
          message={`You don't have access to this form. Your role: ${userRole || "none"}`}
        />
      );
    }
  }

  // If authenticated and has required permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
