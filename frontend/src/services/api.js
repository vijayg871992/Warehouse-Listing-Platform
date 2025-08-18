import axios from 'axios';
import { BACKEND_URL, DEFAULT_HEADERS } from '../config/api';

// Create axios instance
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: DEFAULT_HEADERS,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add visitor ID for analytics
    const visitorId = localStorage.getItem('visitorId') || generateVisitorId();
    config.headers['x-visitor-id'] = visitorId;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BACKEND_URL}/api/auth/refresh`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Generate unique visitor ID
function generateVisitorId() {
  const visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  localStorage.setItem('visitorId', visitorId);
  return visitorId;
}

// API service functions
export const apiService = {
  // Authentication
  auth: {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    refreshToken: (refreshToken) => api.post('/api/auth/refresh', { refreshToken }),
  },
  
  // Private Warehouses (Authenticated)
  warehouses: {
    getAll: (params) => api.get('/api/warehouses', { params }),
    getById: (id) => api.get(`/api/warehouses/${id}`),
    create: (formData) => api.post('/api/warehouses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/api/warehouses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/api/warehouses/${id}`),
    getAnalytics: (params) => api.get('/api/warehouses/analytics', { params }),
    getStats: () => api.get('/api/warehouses/stats'),
    getMy: (params) => api.get('/api/warehouses/my', { params }),
  },
  
  // Public Warehouses (No Auth Required)
  public: {
    getWarehouses: (params) => api.get('/api/public/warehouses', { params }),
    getWarehouseById: (id) => api.get(`/api/public/warehouses/${id}`),
    getStats: () => api.get('/api/public/warehouses/stats'),
    getFeatured: (params) => api.get('/api/public/warehouses/featured', { params }),
  },
  
  // Admin APIs (Authenticated Admin Only)
  admin: {
    getAllWarehouses: (params) => api.get('/api/admin/warehouses', { params }),
    getPendingWarehouses: (params) => api.get('/api/admin/warehouses/pending', { params }),
    getWarehouseById: (id) => api.get(`/api/admin/warehouses/${id}`),
    approveWarehouse: (id, comment) => api.post(`/api/admin/warehouses/${id}/approve`, { comment }),
    rejectWarehouse: (id, comment) => api.post(`/api/admin/warehouses/${id}/reject`, { comment }),
    updateWarehouse: (id, data) => api.put(`/api/admin/warehouses/${id}`, data),
    deleteWarehouse: (id) => api.delete(`/api/admin/warehouses/${id}`),
    getDashboardStats: () => api.get('/api/admin/stats/dashboard'),
    getAnalyticsData: (params) => api.get('/api/admin/analytics', { params }),
    getWarehouseAnalytics: (params) => api.get('/api/admin/warehouses/analytics', { params }),
  },
  
  // Utility
  getCitySuggestions: (query) => api.get('/api/cities', { params: { query }}),
};

export default api;