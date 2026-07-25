import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { APP_CONFIG } from '@/constants/app.constants';

/**
 * Pre-configured Axios instance for all API calls.
 * Base URL is set from APP_CONFIG.
 */
export const apiClient = axios.create({
  baseURL: APP_CONFIG.api.baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor ----
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ---- Response Interceptor ----
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized — token refresh or redirect to login
    if (error.response?.status === 401) {
      // TODO: Implement token refresh logic
      // localStorage.removeItem('accessToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
