import { useUserStore } from "@/src/store/useUserStore";

export function usePermission() {
    const { user } = useUserStore();

    const can = (permission: string) => {
        if (user?.is_admin) return true;
        // Logic for specific permissions if needed
        return false;
    };

    return { can, isAdmin: user?.is_admin };
}
