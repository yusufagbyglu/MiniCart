// src/services/wishlist-service.ts
import { BaseService } from './base-service'
import type { Product } from '@/types/product'

class WishlistService extends BaseService {
  private static instance: WishlistService

  private constructor() {
    super()
  }

  public static getInstance(): WishlistService {
    if (!WishlistService.instance) {
      WishlistService.instance = new WishlistService()
    }
    return WishlistService.instance
  }

  public async getWishlist(): Promise<Product[]> {
    return this.get<Product[]>('/wishlist')
  }

  public async addToWishlist(productId: number): Promise<void> {
    await this.post(`/wishlist/${productId}`)
  }

  public async removeFromWishlist(productId: number): Promise<void> {
    await this.delete(`/wishlist/${productId}`)
  }

  public async isInWishlist(productId: number): Promise<boolean> {
    const wishlist = await this.getWishlist()
    return wishlist.some(item => item.id === productId)
  }
}

export const wishlistService = WishlistService.getInstance()