import { useUserStore } from "@/src/store/useUserStore";
import { AuthService } from "@/src/services/AuthService";
import { LoginFormData, RegisterFormData } from "@/src/types/auth";

export function useAuth() {
    const { user, setUser, logout: clearStore } = useUserStore();

    const login = async (data: LoginFormData) => {
        const authUser = await AuthService.login(data);
        setUser(authUser);
        return authUser;
    };

    const register = async (data: RegisterFormData) => {
        const authUser = await AuthService.register(data);
        setUser(authUser);
        return authUser;
    };

    const logout = async () => {
        await AuthService.logout();
        clearStore();
    };

    return {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };
}
