import { Outlet } from 'react-router-dom';

/**
 * Authentication layout for login, register, forgot password, etc.
 * Minimal layout without sidebar/header.
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
