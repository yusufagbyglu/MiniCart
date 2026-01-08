import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items;
                const existingItem = items.find((i) => i.id === newItem.id);

                if (existingItem) {
                    set({
                        items: items.map((i) =>
                            i.id === newItem.id
                                ? { ...i, quantity: i.quantity + newItem.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (id) =>
                set({ items: get().items.filter((i) => i.id !== id) }),
            updateQuantity: (id, quantity) =>
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                }),
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: "minicart-storage",
        }
    )
);
