import { apiClient } from '@/api/client';

export const adminApi = {
  // Users
  getUsers: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/admin/users?${params.toString()}`);
    return response.data.data;
  },
  updateUserStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data.data;
  },

  // Roles
  getRoles: async () => {
    const response = await apiClient.get('/admin/roles');
    return response.data.data;
  },
  getPermissions: async () => {
    const response = await apiClient.get('/admin/permissions');
    return response.data.data;
  },
  assignRolePermissions: async (roleId: string, permissionIds: string[]) => {
    const response = await apiClient.put(`/admin/roles/${roleId}/permissions`, { permissionIds });
    return response.data.data;
  },

  // Settings
  getSettings: async (category: string) => {
    const response = await apiClient.get(`/admin/settings/${category}`);
    return response.data.data;
  },
  updateSettings: async (category: string, configData: any) => {
    const response = await apiClient.put(`/admin/settings/${category}`, configData);
    return response.data.data;
  },

  // Audit Logs
  getAuditLogs: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/admin/audit-logs?${params.toString()}`);
    return response.data.data;
  },

  // System Health
  getSystemHealth: async () => {
    const response = await apiClient.get('/admin/health');
    return response.data.data;
  },
};
