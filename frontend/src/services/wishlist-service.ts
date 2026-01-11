import api from "@/lib/axios"
import type { WishlistItem } from "@/types/wishlist"
import type { ApiResponse } from "@/types/api"

export const WishlistService = {
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await api.get<ApiResponse<WishlistItem[]>>("/user/wishlist")
    return response.data.data
  },

  async addToWishlist(productId: number): Promise<WishlistItem> {
    const response = await api.post<ApiResponse<WishlistItem>>(`/user/wishlist/${productId}`)
    return response.data.data
  },

  async removeFromWishlist(productId: number): Promise<void> {
    await api.delete(`/user/wishlist/${productId}`)
  },
}
