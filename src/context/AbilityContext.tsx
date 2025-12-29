import { createContext, ReactNode, useContext, useMemo } from "react";
import { createContextualCan } from "@casl/react";
import { AppAbility, defineAbilityFor, Role } from "../config/abilities";
import { ALLOWED_APP_ROLES, logRoleDebug, mapRoleValueToRole } from "../services/roleMapper";
import { useAuth } from "../components/Header";
import { useOrganizationInfo } from "../hooks/useOrganizationInfo";
import { isDemoModeEnabled } from "../utils/demoAuthUtils";

interface AbilityContextType {
    ability: AppAbility;
    role: Role | undefined; // May be undefined if no role found from API
    isRoleLoading: boolean;
}

// Create React Context for CASL ability (used by @casl/react hooks and Can component)
// Default to restricted ability (unknown role) to ensure context always has a value
// Unknown roles are restricted from dashboard access per Customer Segment Permissions Matrix
const defaultAbility = defineAbilityFor(undefined);
export const CASLAbilityContext = createContext<AppAbility>(defaultAbility);

// Create contextual Can component bound to CASLAbilityContext
export const Can = createContextualCan(CASLAbilityContext.Consumer);

// Create our custom context for ability + role (for useAbilityContext hook)
const AbilityContext = createContext<AbilityContextType | undefined>(undefined);

export function AbilityProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { user, userRole: userRoleFromAuth } = useAuth();
  const {
    organization,
    profile,
    isLoading: organizationLoading,
  } = useOrganizationInfo();

  // Extract userRole from AuthContext (which extracts from API kf_accessroles field)
  const role = useMemo((): Role | undefined => {
    // In demo mode, always return admin role
    if (isDemoModeEnabled()) {
      return "admin";
    }

    const authRole = (userRoleFromAuth || user?.userRole) as Role | undefined;
    let normalizedRole =
      authRole && ALLOWED_APP_ROLES.includes(authRole)
        ? authRole
        : undefined;

    if (!normalizedRole && (organization || profile)) {
      const fallbackValue =
        profile?.kf_accessroles ?? organization?.kf_accessroles ?? null;
      if (fallbackValue !== null && fallbackValue !== undefined) {
        const mapped = mapRoleValueToRole(fallbackValue);
        if (mapped && ALLOWED_APP_ROLES.includes(mapped)) {
          normalizedRole = mapped;
        }
      }
    }

    logRoleDebug(authRole ?? "runtime:AbilityContext", normalizedRole, "AbilityContext");
    return normalizedRole;
  }, [user, userRoleFromAuth, organization, profile]);

  const ability = useMemo(() => defineAbilityFor(role), [role]);

  // isRoleLoading should be true only if:
  // 1. Organization is still loading AND
  // 2. We don't have a role yet AND
  // 3. User is authenticated
  // Once organization loading completes (even if role is missing), stop showing loading
  // In demo mode, never show loading state
  const isRoleLoading = isDemoModeEnabled() ? false : Boolean(organizationLoading && !role && user);

  const contextValue = useMemo<AbilityContextType>(
    () => ({
      ability,
      role,
      isRoleLoading,
    }),
    [ability, role, isRoleLoading]
  );

  const abilityToProvide = ability;

  return (
    <CASLAbilityContext.Provider value={abilityToProvide}>
      <AbilityContext.Provider value={contextValue}>
        {children}
      </AbilityContext.Provider>
    </CASLAbilityContext.Provider>
  );
}

export function useAbilityContext() {
    const context = useContext(AbilityContext);
    if (context === undefined) {
        throw new Error("useAbilityContext must be used within an AbilityProvider");
    }
    return context;
}
