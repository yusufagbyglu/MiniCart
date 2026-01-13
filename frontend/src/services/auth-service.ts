import { BaseService } from './base-service'
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User,
  ForgotPasswordData,
  ResetPasswordData
} from '@/types/auth'

class AuthService extends BaseService {
  private static instance: AuthService

  private constructor() {
    super()
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/login', credentials)
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/register', data)
  }

  public async logout(): Promise<void> {
    await this.post('/auth/logout')
  }

  public async refreshToken(): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh-token')
  }

  public async getCurrentUser(): Promise<User> {
    return this.get<User>('/user')
  }

  public async getProfile(): Promise<User> {
    return this.get<User>('/auth/me')
  }

  public async updateProfile(data: Partial<User>): Promise<User> {
    return this.put<User>('/user/profile', data)
  }

  public async updatePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await this.put('/user/password', data)
  }

  public async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await this.post('/auth/forgot-password', data)
  }

  public async resetPassword(data: ResetPasswordData): Promise<void> {
    await this.post('/auth/reset-password', data)
  }

  public async verifyEmail(id: string, hash: string): Promise<void> {
    await this.get(`/auth/email/verify/${id}/${hash}`)
  }

  public async resendVerificationEmail(): Promise<void> {
    await this.post('/auth/email/verification-notification')
  }
}

export const authService = AuthService.getInstance()