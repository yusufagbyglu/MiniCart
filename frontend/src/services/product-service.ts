// src/services/product-service.ts
import { BaseService } from './base-service'
import type { Product, ProductFilters } from '@/types/product'

class ProductService extends BaseService {
  private static instance: ProductService

  private constructor() {
    super()
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  public async getProducts(filters?: ProductFilters): Promise<Product[]> {
    return this.get<Product[]>('/products', { params: filters })
  }

  public async getProduct(slug: string): Promise<Product> {
    return this.get<Product>(`/products/${slug}`)
  }

  public async searchProducts(query: string): Promise<Product[]> {
    return this.get<Product[]>('/products/search', { params: { q: query } })
  }
}

export const productService = ProductService.getInstance()