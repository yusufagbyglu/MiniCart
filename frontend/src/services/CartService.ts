import api from "@/src/lib/axios";
import { Cart } from "@/src/types/cart";
import { ApiResponse } from "@/src/types/api";

export const CartService = {
    // Get current cart
    getCart: async (guestId?: string): Promise<Cart> => {
        const params = guestId ? { guest_identifier: guestId } : {};
        const response = await api.get<ApiResponse<Cart>>("/cart", { params });
        return response.data.data;
    },

    // Add item to cart
    addItem: async (productId: number, quantity: number = 1, guestId?: string): Promise<Cart> => {
        const response = await api.post<ApiResponse<Cart>>("/cart/items", {
            product_id: productId,
            quantity,
            guest_identifier: guestId,
        });
        return response.data.data;
    },

    // Update cart item quantity
    updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
        const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
            quantity,
        });
        return response.data.data;
    },

    // Remove item from cart
    removeItem: async (itemId: number): Promise<Cart> => {
        const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
        return response.data.data;
    },

    // Clear entire cart
    clearCart: async (): Promise<void> => {
        await api.delete("/cart");
    },

    // Apply coupon
    applyCoupon: async (code: string): Promise<Cart> => {
        const response = await api.post<ApiResponse<Cart>>("/cart/coupon", { code });
        return response.data.data;
    },

    // Remove coupon
    removeCoupon: async (): Promise<Cart> => {
        const response = await api.delete<ApiResponse<Cart>>("/cart/coupon");
        return response.data.data;
    },
};
