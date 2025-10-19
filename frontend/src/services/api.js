import axios from 'axios';
import apiLogger from '../utils/logger';

// Konfigurasi base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  timestamp: new Date().toISOString(),
});

// Instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

// Interceptor untuk menambahkan token ke setiap request dan log
api.interceptors.request.use(
  (config) => {
    // Add token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request
    apiLogger.logRequest(config);

    return config;
  },
  (error) => {
    apiLogger.logError(error);
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error response secara global dan log
api.interceptors.response.use(
  (response) => {
    // Log successful response
    apiLogger.logResponse(response);
    return response;
  },
  (error) => {
    // Log error
    apiLogger.logError(error);

    // Handle error berdasarkan status code
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired atau tidak valid
          console.warn('🔒 Unauthorized - Clearing auth data');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
          break;
        case 403:
          console.error('🚫 Access forbidden');
          break;
        case 404:
          console.error('🔍 Resource not found');
          break;
        case 500:
          console.error('💥 Server error');
          break;
        default:
          console.error('⚠️ API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('🌐 Network error - no response received');
      console.error('Request details:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
    } else {
      console.error('❌ Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  // Login user atau admin
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Register team baru
  register: (teamData) => api.post('/teams/register', teamData),
  
  // Verifikasi email dengan token
  verify: (token) => api.get(`/teams/verify?token=${token}`),
  
  // Logout (hapus token dari localStorage)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Team Services
export const teamService = {
  // Get info team saat ini
  getTeamInfo: () => api.get('/teams/get-team'),
  
  // Add member ke team
  addMember: (memberData) => api.post('/teams/members', memberData),
  
  // List semua team (untuk admin)
  listTeams: (query = '') => api.get(`/teams/?q=${query}`),
};

// Admin Services (akan ditambahkan sesuai API yang tersedia)
export const adminService = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Approve team
  approveTeam: (teamId) => api.post(`/admin/teams/${teamId}/approve`),
  
  // Reject team
  rejectTeam: (teamId) => api.post(`/admin/teams/${teamId}/reject`),
  
  // Bracket management
  getBracket: () => api.get('/admin/bracket'),
  updateMatch: (matchId, matchData) => api.put(`/admin/bracket/${matchId}`, matchData),
};

export default api;
