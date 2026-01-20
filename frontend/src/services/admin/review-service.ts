import { BaseService } from '../base-service'
import type { Review } from '@/types/review'
import { PaginatedResponse } from '@/types/api'

class AdminReviewService extends BaseService {
    private static instance: AdminReviewService

    private constructor() {
        super()
    }

    public static getInstance(): AdminReviewService {
        if (!AdminReviewService.instance) {
            AdminReviewService.instance = new AdminReviewService()
        }
        return AdminReviewService.instance
    }

    public async getReviews(params?: any): Promise<PaginatedResponse<Review>> {
        return this.getPaginated<Review>('/admin/reviews', { params })
    }

    public async toggleApproval(id: number): Promise<{ message: string, review: Review }> {
        return this.put<{ message: string, review: Review }>(`/admin/reviews/${id}/toggle-approval`, {})
    }

    public async deleteReview(id: number): Promise<void> {
        await this.delete(`/admin/reviews/${id}`)
    }

    public async getReviewStats(): Promise<{ total_reviews: number, pending_count: number, average_rating: number }> {
        return this.get('/admin/reviews/stats')
    }
}

export const adminReviewService = AdminReviewService.getInstance()
