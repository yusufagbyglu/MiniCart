import { BaseService } from '../base-service'
import type { Product, Category } from '@/types/product'

class AdminProductService extends BaseService {
    private static instance: AdminProductService

    private constructor() {
        super()
    }

    public static getInstance(): AdminProductService {
        if (!AdminProductService.instance) {
            AdminProductService.instance = new AdminProductService()
        }
        return AdminProductService.instance
    }

    // Product Management (Management Prefix)
    public async getProducts(params?: any): Promise<Product[]> {
        return this.get<Product[]>('/admin/products', { params })
    }

    public async createProduct(data: any): Promise<Product> {
        return this.post<Product>('/management/products', data)
    }

    public async updateProduct(slug: string, data: any): Promise<Product> {
        if (data instanceof FormData) {
            return this.post<Product>(`/management/products/${slug}`, data)
        }
        return this.put<Product>(`/management/products/${slug}`, data)
    }

    public async deleteProduct(slug: string): Promise<void> {
        await this.delete(`/management/products/${slug}`)
    }

    public async addProductImage(slug: string, file: File): Promise<Product> {
        return this.uploadFile<Product>(`/management/products/${slug}/images`, file, 'image')
    }

    public async deleteProductImage(slug: string, imageId: number): Promise<void> {
        await this.delete(`/management/products/${slug}/images/${imageId}`)
    }

    public async getProductStats(): Promise<any> {
        return this.get('/admin/products/stats')
    }

    public async importProducts(file: File): Promise<any> {
        return this.uploadFile('/admin/products/import', file, 'file')
    }
}

export const adminProductService = AdminProductService.getInstance()
