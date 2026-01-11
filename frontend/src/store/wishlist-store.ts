import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WishlistItem } from "@/types/wishlist"

interface WishlistState {
  items: WishlistItem[]
  isLoading: boolean
  setItems: (items: WishlistItem[]) => void
  addItem: (item: WishlistItem) => void
  removeItem: (productId: number) => void
  setLoading: (loading: boolean) => void
  isInWishlist: (productId: number) => boolean
  getCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items.filter((i) => i.product_id !== item.product_id), item],
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      isInWishlist: (productId) => {
        const { items } = get()
        return items.some((item) => item.product_id === productId)
      },

      getCount: () => get().items.length,
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
