export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterCompanyAdminDto {
  companyName: string;
  companyCode: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string;
    branchId?: string | null;
    avatarUrl?: string | null;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: string;
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
  permissions: Array<{ module: string; action: string }>;
}
