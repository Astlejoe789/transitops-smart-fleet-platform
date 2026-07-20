import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/providers/AuthProvider';

/**
 * Custom hook to consume the global AuthContext.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
