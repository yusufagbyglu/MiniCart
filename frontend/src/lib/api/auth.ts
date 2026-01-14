import axios from "@/lib/axios"

export const authApi = {
  async register(userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    const response = await axios.post("/api/register", userData)
    return response.data
  },

  async login(credentials: { email: string; password: string }) {
    const response = await axios.post("/api/login", credentials)
    return response.data
  },

  async logout() {
    const response = await axios.post("/api/logout")
    return response.data
  },

  async getCurrentUser() {
    const response = await axios.get("/api/user")
    return response.data
  },

  async forgotPassword(email: string) {
    const response = await axios.post("/api/forgot-password", { email })
    return response.data
  },

  async resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) {
    const response = await axios.post("/api/reset-password", data)
    return response.data
  },
}