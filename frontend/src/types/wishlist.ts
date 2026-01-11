import type { Product } from "./product"

export interface WishlistItem {
  id: number
  user_id: number
  product_id: number
  product: Product
  created_at: string
}
