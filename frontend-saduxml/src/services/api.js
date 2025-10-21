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

// Team Services (User)
export const teamService = {
  // Get info team saat ini (authenticated user)
  getTeamInfo: () => api.get('/teams/get-team'),
  
  // Get members dari team saat ini
  getMembers: () => api.get('/teams/get-members'),
  
  // Add member ke team
  addMember: (memberData) => api.post('/teams/members', memberData),
  
  // Update member
  updateMember: (memberId, memberData) => api.put(`/teams/members/${memberId}`, memberData),
  
  // Delete member dari team
  deleteMember: (memberId) => api.delete(`/teams/remove-members/?memberId=${memberId}`),
};

// Group Services (User & Admin)
export const groupService = {
  // List all groups
  listGroups: (query = '') => api.get(`/groups/?q=${query}`),
  
  // Create group (Admin only)
  createGroup: (groupData) => api.post('/groups/', groupData),
};

// Stage Services (User & Admin)
export const stageService = {
  // List all stages
  listStages: (query = '') => api.get(`/stages/?q=${query}`),
  
  // Create stage (Admin only)
  createStage: (stageData) => api.post('/stages/', stageData),
  
  // Update stage (Admin only)
  updateStage: (stageId, stageData) => api.put(`/stages/${stageId}`, stageData),
  
  // Delete stage (Admin only)
  deleteStage: (stageId) => api.delete(`/stages/${stageId}`),
};

// Match Services (User & Admin)
export const matchService = {
  // List all matches
  listMatches: (query = '') => api.get(`/matches/?q=${query}`),
  
  // Create match (Admin only)
  createMatch: (matchData) => api.post('/matches/', matchData),
  
  // Update match (Admin only)
  updateMatch: (matchId, matchData) => api.put(`/matches/${matchId}`, matchData),
  
  // Delete match (Admin only)
  deleteMatch: (matchId) => api.delete(`/matches/${matchId}`),
};

// Match Round Services (User & Admin)
export const matchRoundService = {
  // List all match rounds
  listMatchRounds: (query = '') => api.get(`/match-rounds/?q=${query}`),
  
  // Create match round (Admin only)
  createMatchRound: (roundData) => api.post('/match-rounds/', roundData),
  
  // Update match round (Admin only)
  updateMatchRound: (roundId, roundData) => api.put(`/match-rounds/${roundId}`, roundData),
  
  // Delete match round (Admin only)
  deleteMatchRound: (roundId) => api.delete(`/match-rounds/${roundId}`),
};

// Admin Services
export const adminService = {
  // Teams Management
  teams: {
    // List all teams
    list: (query = '') => api.get(`/teams/?q=${query}`),
    // Update team
    update: (teamId, teamData) => api.put(`/teams/${teamId}`, teamData),
    // Delete team
    delete: (teamId) => api.delete(`/teams/${teamId}`),
  },

  // Approve team - Update status to approved
  // Note: Adjust endpoint format based on your backend implementation
  // Option 1: PUT /teams/:id/status with body { status: 'approved' }
  // Option 2: POST /admin/teams/:id/approve
  approveTeam: (teamId) => api.put(`/teams/${teamId}/status`, { status: 'approved' }),

  // Reject team - Update status to rejected
  rejectTeam: (teamId) => api.put(`/teams/${teamId}/status`, { status: 'rejected' }),

  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),
};

// Bracket Services (Admin & User)
export const bracketService = {
  // Generate bracket for a stage (Admin only)
  // bracketConfig: { stageId, type: 'single_elimination', seeding: 'random' | 'sequential' | 'manual', teamIds: [] }
  generateBracket: (bracketConfig) => api.post('/brackets/generate', bracketConfig),

  // Get bracket structure for visualization
  getBracketStructure: (stageId) => api.get(`/brackets/structure/${stageId}`),

  // Update match from bracket view (Admin only)
  updateBracketMatch: (matchId, matchData) => api.put(`/brackets/matches/${matchId}`, matchData),

  // Get full bracket with matches grouped by rounds
  getFullBracket: (stageId) => api.get(`/brackets/${stageId}`),
};

// Event Services (Admin) - Real API Implementation
export const eventService = {
  // List all events (no search parameter needed, returns all)
  listEvents: () => api.get('/events/'),

  // Get single event by ID
  getEvent: (eventId) => api.get(`/events/${eventId}`),

  // Create new event
  createEvent: (eventData) => api.post('/events/', eventData),

  // Update existing event
  updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),

  // Delete event
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

export default api;
