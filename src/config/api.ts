/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

import { API_BASE_URL } from './apiBase';

// Express server URL - uses same-origin API base to avoid CORS in demos.
export const EXPRESS_SERVER_URL = API_BASE_URL;

// Vercel API URL - for file uploads and blob operations
export const VERCEL_API_URL = 
  import.meta.env.VITE_VERCEL_API_URL || 
  (typeof window !== 'undefined' ? window.location.origin : '');

