// API Configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.PROD ? 'https://vijayg.dev/warehouse-listing' : 'http://localhost:8002');

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  
  // Private Warehouse APIs (Authenticated)
  WAREHOUSES: {
    LIST: '/api/warehouses',
    CREATE: '/api/warehouses',
    GET_BY_ID: (id) => `/api/warehouses/${id}`,
    UPDATE: (id) => `/api/warehouses/${id}`,
    DELETE: (id) => `/api/warehouses/${id}`,
    ANALYTICS: '/api/warehouses/analytics',
    STATS: '/api/warehouses/stats',
    MY_WAREHOUSES: '/api/warehouses/my',
    TRACK_VIEW: (id) => `/api/warehouses/${id}/view`,
  },
  
  // Public Warehouse APIs (No Auth)
  PUBLIC: {
    WAREHOUSES: '/api/public/warehouses',
    WAREHOUSE_BY_ID: (id) => `/api/public/warehouses/${id}`,
    TRACK_VIEW: (id) => `/api/public/warehouses/${id}/view`,
    STATS: '/api/public/warehouses/stats',
    FEATURED: '/api/public/warehouses/featured',
  },
  
  // Utility
  CITIES: '/api/cities',
};

// Default headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};