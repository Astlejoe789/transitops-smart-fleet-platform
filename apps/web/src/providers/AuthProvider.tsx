import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authService, type UserProfileResponse, type UserPermission } from '@/modules/auth/services/auth.service';
import { storage } from '@/utils/storage';
import type { LoginCredentials } from '@/types/auth.types';

export interface AuthContextType {
  user: UserProfileResponse | null;
  accessToken: string | null;
  permissions: UserPermission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (module: string, action: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => storage.get<string>('accessToken'));
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize token state with localStorage
  const handleSetTokens = (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access);
    storage.set('accessToken', access);
    storage.set('refreshToken', refresh);
    setAccessToken(access);
  };

  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    storage.remove('accessToken');
    storage.remove('refreshToken');
    setAccessToken(null);
    setUser(null);
    setPermissions([]);
  };

  // Fetch logged in user profile on initial mount or token update
  const fetchUser = useCallback(async () => {
    const token = storage.get<string>('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const profile = await authService.getCurrentUser();
      setUser(profile);
      setPermissions(profile.permissions || []);
    } catch {
      // If token is expired, try silent refresh
      const refreshToken = storage.get<string>('refreshToken');
      if (refreshToken) {
        try {
          const { accessToken: newAccess } = await authService.refreshToken(refreshToken);
          localStorage.setItem('accessToken', newAccess);
          storage.set('accessToken', newAccess);
          setAccessToken(newAccess);
          const profile = await authService.getCurrentUser();
          setUser(profile);
          setPermissions(profile.permissions || []);
        } catch {
          clearTokens();
        }
      } else {
        clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      handleSetTokens(authData.tokens.accessToken, authData.tokens.refreshToken);
      setUser(authData.user);
      setPermissions(authData.user.permissions || []);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearTokens();
    }
  };

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.role === 'COMPANY_ADMIN') return true;
    return permissions.some((p) => p.module === module && p.action === action);
  };

  const hasRole = (...roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
