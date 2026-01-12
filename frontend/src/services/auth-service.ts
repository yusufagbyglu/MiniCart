// src/services/auth-service.ts
import { BaseService } from './base-service'
import type { LoginCredentials, AuthResponse, RegisterData } from '@/types/auth'

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

  public async logout(): Promise<void> {
    await this.post('/auth/logout')
  }

  public async refreshToken(): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh-token')
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/register', data)
  }

  public async getCurrentUser(): Promise<any> {
    return this.get('/user')
  }
}

export const authService = AuthService.getInstance()