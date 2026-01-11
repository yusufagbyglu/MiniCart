import type { Product } from "./product"

export interface Cart {
  id: number
  user_id: number | null
  session_id: string | null
  items: CartItem[]
  subtotal: number
  tax_amount: number
  discount_amount: number
  total: number
  coupon?: AppliedCoupon | null
}

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  product: Product
  quantity: number
  price: number
  total: number
}

export interface AddToCartData {
  product_id: number
  quantity: number
}

export interface UpdateCartItemData {
  quantity: number
}

export interface AppliedCoupon {
  id: number
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  discount_amount: number
}
