import api from "@/lib/axios"
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from "@/types/auth"
import type { ApiResponse } from "@/types/api"

export const AuthService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", data)
    return response.data.data
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials)
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout")
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh-token")
    return response.data.data
  },

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await api.post("/auth/forgot-password", data)
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await api.post("/auth/reset-password", data)
  },

  async verifyEmail(id: string, hash: string): Promise<void> {
    await api.get(`/auth/email/verify/${id}/${hash}`)
  },

  async resendVerificationEmail(): Promise<void> {
    await api.post("/auth/email/verification-notification")
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/user/profile")
    return response.data.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>("/user/profile", data)
    return response.data.data
  },

  async updatePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await api.put("/user/password", data)
  },
}
