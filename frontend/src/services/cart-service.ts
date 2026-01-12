import { BaseService } from './base-service'
import type { Cart, CartItem } from '@/types/cart'

class CartService extends BaseService {
  private static instance: CartService

  private constructor() {
    super()
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService()
    }
    return CartService.instance
  }

  public async getCart(): Promise<Cart> {
    return this.get<Cart>('/cart')
  }

  public async addToCart(item: CartItem): Promise<Cart> {
    return this.post<Cart>('/cart/items', item)
  }

  public async updateCartItem(itemId: number, quantity: number): Promise<Cart> {
    return this.put<Cart>(`/cart/items/${itemId}`, { quantity })
  }

  public async removeFromCart(itemId: number): Promise<void> {
    await this.delete(`/cart/items/${itemId}`)
  }

  public async applyCoupon(code: string): Promise<Cart> {
    return this.post<Cart>('/cart/apply-coupon', { code })
  }

  public async removeCoupon(): Promise<Cart> {
    return this.delete<Cart>('/cart/remove-coupon')
  }
}

export const cartService = CartService.getInstance()