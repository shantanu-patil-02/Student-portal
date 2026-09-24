import axios from 'axios';

// Resolve API URL: default to relative '/api' so it works seamlessly on any host/preview
const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (
    !envUrl ||
    typeof envUrl !== 'string' ||
    envUrl.includes('localhost') ||
    envUrl.includes('127.0.0.1') ||
    envUrl === '.' ||
    envUrl === './' ||
    envUrl === '/api'
  ) {
    return '/api';
  }
  const trimmed = envUrl.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return '/api';
};

const API_URL = getBaseApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login/register pages
      const isAuthEndpoint =
        error.config.url?.includes('/auth/login') ||
        error.config.url?.includes('/auth/register');

      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Task Service Endpoints
export const taskService = {
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') {
        params.append('status', filters.status);
      }
      if (filters.priority && filters.priority !== 'All') {
        params.append('priority', filters.priority);
      }
      if (filters.sort) {
        params.append('sort', filters.sort);
      }
      const response = await api.get(`/tasks?${params.toString()}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn('[TaskService getTasks] Request failed, returning empty list:', error.message);
      return [];
    }
  },
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
