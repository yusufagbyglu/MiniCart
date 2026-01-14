import { BaseService } from '../base-service'
import type { Category } from '@/types/product'

class AdminCategoryService extends BaseService {
    private static instance: AdminCategoryService

    private constructor() {
        super()
    }

    public static getInstance(): AdminCategoryService {
        if (!AdminCategoryService.instance) {
            AdminCategoryService.instance = new AdminCategoryService()
        }
        return AdminCategoryService.instance
    }

    public async getCategories(): Promise<Category[]> {
        return this.get<Category[]>('/categories')
    }

    public async createCategory(data: any): Promise<Category> {
        return this.post<Category>('/management/categories', data)
    }

    public async updateCategory(id: number, data: any): Promise<Category> {
        return this.put<Category>(`/management/categories/${id}`, data)
    }

    public async deleteCategory(id: number): Promise<void> {
        await this.delete(`/management/categories/${id}`)
    }
}

export const adminCategoryService = AdminCategoryService.getInstance()
