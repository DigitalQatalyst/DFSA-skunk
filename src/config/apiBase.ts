/**
 * API base for same-origin proxy.
 * Default to /api/v1 to avoid CORS in demo deployments.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
export const API_ROOT_URL = API_BASE_URL.startsWith("/api/v1")
  ? "/api"
  : (API_BASE_URL.replace(/\/api\/v1\/?$/, "/api"));

