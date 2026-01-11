export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  base_currency: string
  stock: number
  category_id: number
  category?: Category
  tax_class_id: number
  tax_class?: TaxClass
  is_active: boolean
  sku: string
  weight: number | null
  length: number | null
  width: number | null
  height: number | null
  featured: boolean
  sales_count: number
  images: ProductImage[]
  reviews?: Review[]
  average_rating?: number
  review_count?: number
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  alt_text: string | null
  sort_order: number
}

export interface Category {
  id: number
  name: string
  slug?: string
  description: string | null
  parent_id: number | null
  parent?: Category
  children?: Category[]
  product_count?: number
}

export interface TaxClass {
  id: number
  name: string
  description: string | null
}

export interface TaxRate {
  id: number
  name: string
  country: string
  state: string | null
  city: string | null
  tax_type: "vat" | "sales" | "gst" | "hst" | "pst" | "service" | "custom"
  rate: number
  is_active: boolean
}

export interface ProductFilters {
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
  in_stock?: boolean
  featured?: boolean
  sort_by?: "price_asc" | "price_desc" | "newest" | "popular" | "rating"
  page?: number
  per_page?: number
}

export interface Review {
  id: number
  product_id: number
  user_id: number
  user?: { id: number; name: string }
  rating: number
  title: string | null
  comment: string | null
  is_approved: boolean
  created_at: string
}
