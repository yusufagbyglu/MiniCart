export interface Review {
  id: number
  product_id: number
  user_id: number
  user?: {
    id: number
    name: string
  }
  rating: number
  title: string | null
  comment: string | null
  is_approved: boolean
  approved_by: number | null
  created_at: string
  updated_at: string
}

export interface CreateReviewData {
  rating: number
  title?: string
  comment?: string
}

export interface UpdateReviewData {
  rating?: number
  title?: string
  comment?: string
}
