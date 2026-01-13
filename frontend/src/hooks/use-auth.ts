"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/store/user-store"
import { authService } from "@/services/auth-service"
import type { LoginCredentials, RegisterData } from "@/types/auth"
import { useToast } from "@/hooks/use-toast"

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout, setLoading } = useUserStore()

  // Fetch current user profile
  const { isLoading: isLoadingProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      storeLogin(data.user, data.token)
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast({ title: "Welcome back!", description: `Logged in as ${data.user.name}` })
      router.push("/")
    },
    onError: (error: Error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      storeLogin(data.user, data.token)
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast({ title: "Account created!", description: "Please verify your email address." })
      router.push("/")
    },
    onError: (error: Error) => {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" })
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      storeLogout()
      queryClient.clear()
      toast({ title: "Logged out", description: "Come back soon!" })
      router.push("/")
    },
    onError: () => {
      // Force logout even on error
      storeLogout()
      queryClient.clear()
      router.push("/")
    },
  })

  const login = useCallback((credentials: LoginCredentials) => loginMutation.mutate(credentials), [loginMutation])

  const register = useCallback((data: RegisterData) => registerMutation.mutate(data), [registerMutation])

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation])

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoadingProfile || loginMutation.isPending || registerMutation.isPending,
    login,
    register,
    logout,
    refetchProfile,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  }
}
