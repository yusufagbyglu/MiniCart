// src/services/review-service.ts
import { BaseService } from './base-service'
import type { Review, CreateReviewData, UpdateReviewData } from '@/types/review'

class ReviewService extends BaseService {
  private static instance: ReviewService

  private constructor() {
    super()
  }

  public static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService()
    }
    return ReviewService.instance
  }

  public async getProductReviews(productId: number): Promise<Review[]> {
    return this.get<Review[]>(`/products/${productId}/reviews`)
  }

  public async getUserReviews(): Promise<Review[]> {
    return this.get<Review[]>('/user/reviews')
  }

  public async createReview(productId: number, data: CreateReviewData): Promise<Review> {
    return this.post<Review>(`/products/${productId}/reviews`, data)
  }

  public async updateReview(reviewId: number, data: UpdateReviewData): Promise<Review> {
    return this.put<Review>(`/reviews/${reviewId}`, data)
  }

  public async deleteReview(reviewId: number): Promise<void> {
    await this.delete(`/reviews/${reviewId}`)
  }
}

export const reviewService = ReviewService.getInstance()