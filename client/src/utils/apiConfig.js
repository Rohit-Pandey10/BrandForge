/**
 * Resolves the backend API base URL safely across local and deployed environments.
 * 
 * In production (e.g. Vercel, Netlify, custom domain), frontend and serverless API
 * routes share the same origin (/api/...). Hardcoded localhost targets from .env files
 * are explicitly blocked to prevent ERR_CONNECTION_REFUSED.
 */
export function getApiBaseUrl() {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();

  // If running in browser on a non-local host, never allow localhost/127.0.0.1
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      return '';
    }
  }

  return envUrl;
}

export const API_BASE = getApiBaseUrl();
