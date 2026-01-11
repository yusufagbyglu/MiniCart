import { create } from "zustand";

interface WishlistStore {
    items: number[]; // Product IDs
    addItem: (id: number) => void;
    removeItem: (id: number) => void;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
    items: [],
    addItem: (id) => set((state) => ({ items: [...state.items, id] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
    clearWishlist: () => set({ items: [] }),
}));
