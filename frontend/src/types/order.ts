import type { Product } from "./product"
import type { UserAddress } from "./address"

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export type PaymentMethod = "fake" | "stripe" | "credit_card" | "bank_transfer"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded" | "cancelled"

export interface Order {
  id: number
  user_id: number
  order_number: string
  status: OrderStatus
  total_amount: number
  tax_amount: number
  discount_amount: number
  currency: string
  exchange_rate: number | null
  notes: string | null
  shipping_address: UserAddress
  billing_address: UserAddress
  items: OrderItem[]
  payment?: Payment
  shipping_details?: ShippingDetail
  taxes?: OrderTax[]
  coupons?: OrderCoupon[]
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product: Product
  quantity: number
  unit_price: number
  total_price: number
}

export interface Payment {
  id: number
  order_id: number
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transaction_id: string | null
  currency: string
  created_at: string
}

export interface ShippingDetail {
  id: number
  order_id: number
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  carrier: string | null
  shipping_cost: number
}

export interface OrderTax {
  id: number
  order_id: number
  tax_rate_id: number
  tax_amount: number
  rate: number
}

export interface OrderCoupon {
  id: number
  order_id: number
  coupon_id: number
  discount_amount: number
}

export interface CheckoutData {
  shipping_address_id: number
  billing_address_id: number
  payment_method: PaymentMethod
  notes?: string
}
