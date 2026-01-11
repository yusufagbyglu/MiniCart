export type DiscountType = "percentage" | "fixed"

export interface Coupon {
  id: number
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount: number | null
  max_uses: number | null
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCouponData {
  code: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount?: number
  max_uses?: number
  valid_from: string
  valid_until: string
  is_active?: boolean
}
