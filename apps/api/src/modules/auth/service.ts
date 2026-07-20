import { StatusCodes } from 'http-status-codes';
import { HttpException } from '../../shared/exceptions/http.exception.js';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/index.js';
import { AuthRepository } from './repository.js';
import type {
  LoginDto,
  RegisterCompanyAdminDto,
  RefreshTokenDto,
  ChangePasswordDto,
  AuthResponseDto,
  UserProfileDto,
} from './dto.js';

export class AuthService {
  private repo = new AuthRepository();

  /**
   * Authenticate user with email and password
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.repo.findUserByEmail(dto.email);

    if (!user) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new HttpException(StatusCodes.FORBIDDEN, 'Account is inactive or suspended');
    }

    const isMatch = await comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    // Update last login timestamp
    await this.repo.updateLastLogin(user.id);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      branchId: user.branchId,
      roleId: user.roleId,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        companyId: user.companyId,
        branchId: user.branchId,
        avatarUrl: user.avatarUrl,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Register a new Company and initial Company Admin user
   */
  async registerCompanyAdmin(dto: RegisterCompanyAdminDto): Promise<AuthResponseDto> {
    const existingCompany = await this.repo.findCompanyByCode(dto.companyCode);
    if (existingCompany) {
      throw new HttpException(StatusCodes.CONFLICT, 'Company code already registered');
    }

    const existingUser = await this.repo.findUserByEmail(dto.email);
    if (existingUser) {
      throw new HttpException(StatusCodes.CONFLICT, 'Email address already in use');
    }

    const role = await this.repo.findRoleByName('COMPANY_ADMIN');
    if (!role) {
      throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, 'System role COMPANY_ADMIN not found. Please run seed script.');
    }

    const passwordHash = await hashPassword(dto.password);

    const { user } = await this.repo.createCompanyWithAdmin({
      companyName: dto.companyName,
      companyCode: dto.companyCode,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
      roleId: role.id,
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      companyId: user.companyId,
      branchId: user.branchId,
      roleId: user.roleId,
      role: user.role.name,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
        companyId: user.companyId,
        branchId: user.branchId,
        avatarUrl: user.avatarUrl,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Refresh JWT access token using a valid refresh token
   */
  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyRefreshToken(dto.refreshToken);
      const user = await this.repo.findUserById(decoded.userId);

      if (!user || user.status !== 'ACTIVE') {
        throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid or revoked refresh token');
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        companyId: user.companyId,
        branchId: user.branchId,
        roleId: user.roleId,
        role: user.role.name,
      };

      const accessToken = generateAccessToken(tokenPayload);
      return { accessToken };
    } catch {
      throw new HttpException(StatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
  }

  /**
   * Get authenticated user profile with attached permissions
   */
  async getCurrentUser(userId: string): Promise<UserProfileDto> {
    const user = await this.repo.findUserById(userId);

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    const permissions = user.role.rolePermissions.map((rp) => ({
      module: rp.permission.module,
      action: rp.permission.action,
    }));

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role.name,
      company: {
        id: user.company.id,
        name: user.company.name,
        code: user.company.code,
      },
      branch: user.branch
        ? {
            id: user.branch.id,
            name: user.branch.name,
            code: user.branch.code,
          }
        : null,
      permissions,
    };
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, 'User not found');
    }

    const isMatch = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Current password is incorrect');
    }

    const newHash = await hashPassword(dto.newPassword);
    await this.repo.updateUserPassword(userId, newHash);
  }
}
