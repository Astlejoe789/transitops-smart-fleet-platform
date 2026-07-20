import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

/**
 * Protects routes based on user roles (RBAC).
 * Redirects to /unauthorized if the user lacks the required role.
 */
export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { hasRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasRole(...allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
