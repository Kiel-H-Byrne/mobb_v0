import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Listing, 
  Category, 
  User, 
  SearchFilters,
  ListingSearchResult 
} from '@shared/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = JSON.parse(localStorage.getItem('mobb-auth') || '{}');
    const token = authStore.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to refresh
      const authStore = JSON.parse(localStorage.getItem('mobb-auth') || '{}');
      const token = authStore.state?.token;
      
      if (token) {
        try {
          const refreshResponse = await authApi.refreshToken();
          if (refreshResponse.success && refreshResponse.data) {
            // Update token in localStorage
            authStore.state.token = refreshResponse.data.token;
            localStorage.setItem('mobb-auth', JSON.stringify(authStore));
            
            // Retry original request
            error.config.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('mobb-auth');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response: AxiosResponse<ApiResponse<{ token: string }>> = await api.post('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/auth/logout');
    return response.data;
  },
};

// Listings API
export const listingsApi = {
  getListings: async (params?: {
    page?: number;
    limit?: number;
    categories?: string[];
    verified?: boolean;
  }): Promise<PaginatedResponse<Listing>> => {
    const response: AxiosResponse<PaginatedResponse<Listing>> = await api.get('/listings', { params });
    return response.data;
  },

  getListing: async (id: string): Promise<ApiResponse<Listing>> => {
    const response: AxiosResponse<ApiResponse<Listing>> = await api.get(`/listings/${id}`);
    return response.data;
  },

  createListing: async (data: Partial<Listing>): Promise<ApiResponse<Listing>> => {
    const response: AxiosResponse<ApiResponse<Listing>> = await api.post('/listings', data);
    return response.data;
  },

  updateListing: async (id: string, data: Partial<Listing>): Promise<ApiResponse<Listing>> => {
    const response: AxiosResponse<ApiResponse<Listing>> = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  deleteListing: async (id: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/listings/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response: AxiosResponse<ApiResponse<Category[]>> = await api.get('/categories');
    return response.data;
  },

  getCategory: async (id: string): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.get(`/categories/${id}`);
    return response.data;
  },

  getCategoryByName: async (name: string): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.get(`/categories/name/${encodeURIComponent(name)}`);
    return response.data;
  },

  createCategory: async (data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> => {
    const response: AxiosResponse<ApiResponse<Category>> = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/categories/${id}`);
    return response.data;
  },

  refreshCounts: async (): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post('/categories/refresh-counts');
    return response.data;
  },
};

// Search API
export const searchApi = {
  search: async (params: SearchFilters & {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ListingSearchResult>> => {
    const response: AxiosResponse<PaginatedResponse<ListingSearchResult>> = await api.get('/search', { params });
    return response.data;
  },

  searchNearby: async (params: {
    lat: number;
    lng: number;
    radius?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ListingSearchResult>> => {
    const response: AxiosResponse<PaginatedResponse<ListingSearchResult>> = await api.get('/search/nearby', { params });
    return response.data;
  },

  autocomplete: async (query: string): Promise<ApiResponse<Array<{
    value: string;
    type: 'business' | 'category' | 'location';
    category?: string;
  }>>> => {
    const response = await api.get('/search/autocomplete', { params: { q: query } });
    return response.data;
  },
};

// Users API
export const usersApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User['profile']>): Promise<ApiResponse<User>> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.put('/users/profile', data);
    return response.data;
  },

  getFavorites: async (): Promise<ApiResponse<Listing[]>> => {
    const response: AxiosResponse<ApiResponse<Listing[]>> = await api.get('/users/favorites');
    return response.data;
  },

  addToFavorites: async (listingId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(`/users/favorites/${listingId}`);
    return response.data;
  },

  removeFromFavorites: async (listingId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.delete(`/users/favorites/${listingId}`);
    return response.data;
  },

  verifyListing: async (listingId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(`/users/verify/${listingId}`);
    return response.data;
  },

  deverifyListing: async (listingId: string): Promise<ApiResponse> => {
    const response: AxiosResponse<ApiResponse> = await api.post(`/users/deverify/${listingId}`);
    return response.data;
  },
};

export default api;
