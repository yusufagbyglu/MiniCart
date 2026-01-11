import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/auth"

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        set({ token })
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("auth_token", token)
          } else {
            localStorage.removeItem("auth_token")
          }
        }
      },

      login: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false })
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token)
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        return user.permissions?.includes(permission) ?? false
      },

      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        return user.roles?.some((r) => r.name === role) ?? false
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
