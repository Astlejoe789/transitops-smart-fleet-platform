import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api.types';
import type { User, LoginCredentials } from '@/types/auth.types';

export interface UserPermission {
  module: string;
  action: string;
}

export interface UserProfileResponse extends User {
  phone?: string | null;
  company: {
    id: string;
    name: string;
    code: string;
  };
  branch?: {
    id: string;
    name: string;
    code: string;
  } | null;
  permissions: UserPermission[];
}

export interface AuthResponse {
  user: UserProfileResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  async getCurrentUser(): Promise<UserProfileResponse> {
    const response = await apiClient.get<ApiResponse<UserProfileResponse>>('/auth/me');
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh-token',
      { refreshToken },
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },
};
