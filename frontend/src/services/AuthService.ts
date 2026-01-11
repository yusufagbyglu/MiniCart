import api from "@/src/lib/axios";
import { User } from "@/src/types/user";
import { AuthUser, LoginFormData, RegisterFormData } from "@/src/types/auth";
import { ApiResponse } from "@/src/types/api";

export const AuthService = {
    // Login
    login: async (credentials: LoginFormData): Promise<AuthUser> => {
        const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/login", credentials);
        const { user, token } = response.data.data;

        // Store token in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }

        return { ...user, token };
    },

    // Register
    register: async (data: RegisterFormData): Promise<AuthUser> => {
        const response = await api.post<ApiResponse<{ user: User; token: string }>>("/auth/register", data);
        const { user, token } = response.data.data;

        // Store token in localStorage
        if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(user));
        }

        return { ...user, token };
    },

    // Logout
    logout: async (): Promise<void> => {
        try {
            await api.post("/auth/logout");
        } finally {
            // Always clear local storage
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user");
            }
        }
    },

    // Get current user
    me: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>("/auth/me");
        return response.data.data;
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        if (typeof window !== "undefined") {
            return !!localStorage.getItem("auth_token");
        }
        return false;
    },

    // Get stored user
    getStoredUser: (): User | null => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    },
};
