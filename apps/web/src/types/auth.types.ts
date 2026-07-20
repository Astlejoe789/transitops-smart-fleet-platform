// ---- Authentication Types ----

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'BRANCH_MANAGER'
  | 'FLEET_MANAGER'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'FINANCE_MANAGER'
  | 'VIEWER'
  | (string & {});

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
