import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Cart } from "@/types/cart"

interface CartState {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  setCart: (cart: Cart | null) => void
  setOpen: (open: boolean) => void
  toggleCart: () => void
  setLoading: (loading: boolean) => void
  getItemCount: () => number
  getSubtotal: () => number
}

const emptyCart: Cart = {
  id: 0,
  user_id: null,
  session_id: null,
  items: [],
  subtotal: 0,
  tax_amount: 0,
  discount_amount: 0,
  total: 0,
  coupon: null,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart) => set({ cart }),

      setOpen: (open) => set({ isOpen: open }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setLoading: (loading) => set({ isLoading: loading }),

      getItemCount: () => {
        const { cart } = get()
        if (!cart) return 0
        return cart.items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const { cart } = get()
        return cart?.subtotal ?? 0
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
)
