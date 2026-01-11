import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/types/user";

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "minicart-user",
        }
    )
);
