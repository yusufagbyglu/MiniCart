import api from "@/lib/axios"
import type { Review, CreateReviewData, UpdateReviewData } from "@/types/review"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

export const ReviewService = {
  async getProductReviews(productId: number, page = 1): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page },
    })
    return response.data
  },

  async createReview(productId: number, data: CreateReviewData): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data)
    return response.data.data
  },

  async updateReview(reviewId: number, data: UpdateReviewData): Promise<Review> {
    const response = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, data)
    return response.data.data
  },

  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/reviews/${reviewId}`)
  },

  // Admin endpoints
  async approveReview(reviewId: number): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>(`/admin/reviews/${reviewId}/approve`)
    return response.data.data
  },

  async adminDeleteReview(reviewId: number): Promise<void> {
    await api.delete(`/admin/reviews/${reviewId}`)
  },
}
