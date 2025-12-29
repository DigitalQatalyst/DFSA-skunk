/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Express server URL - for document metadata CRUD operations
// Use localhost:5000 in development, or env variable, or production URL
export const EXPRESS_SERVER_URL = 
  import.meta.env.VITE_EXPRESS_SERVER_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://kfrealexpressserver.vercel.app');

// Vercel API URL - for file uploads and blob operations
export const VERCEL_API_URL = 
  import.meta.env.VITE_VERCEL_API_URL || 
  (typeof window !== 'undefined' ? window.location.origin : '');

