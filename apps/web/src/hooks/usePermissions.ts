import { useAuth } from './useAuth';

/**
 * Custom hook to perform permission and role checks in UI components.
 */
export function usePermissions() {
  const { user, permissions, hasPermission, hasRole } = useAuth();

  return {
    user,
    permissions,
    can: (module: string, action: string) => hasPermission(module, action),
    hasRole: (...roles: string[]) => hasRole(...roles),
    isAdmin: () => hasRole('SUPER_ADMIN', 'COMPANY_ADMIN'),
    isFleetManager: () => hasRole('FLEET_MANAGER'),
    isDispatcher: () => hasRole('DISPATCHER'),
    isDriver: () => hasRole('DRIVER'),
  };
}
