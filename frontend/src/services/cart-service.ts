import api from "@/lib/axios"
import type { Cart, AddToCartData, UpdateCartItemData } from "@/types/cart"
import type { ApiResponse } from "@/types/api"

export const CartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<ApiResponse<Cart>>("/cart")
    return response.data.data
  },

  async addItem(data: AddToCartData): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>("/cart/items", data)
    return response.data.data
  },

  async updateItem(itemId: number, data: UpdateCartItemData): Promise<Cart> {
    const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, data)
    return response.data.data
  },

  async removeItem(itemId: number): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`)
    return response.data.data
  },

  async applyCoupon(code: string): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>("/cart/apply-coupon", { code })
    return response.data.data
  },

  async removeCoupon(): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>("/cart/remove-coupon")
    return response.data.data
  },
}
