// src/services/product-service.ts
import { BaseService } from './base-service'
import type { 
  Product, 
  ProductFilters, 
  Category,
  CreateProductData,
  UpdateProductData
} from '@/types/product'

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

  // Product operations
  public async getProducts(filters?: ProductFilters): Promise<Product[]> {
    return this.get<Product[]>('/products', { params: filters })
  }

  public async getProduct(slug: string): Promise<Product> {
    return this.get<Product>(`/products/${slug}`)
  }

  public async searchProducts(query: string): Promise<Product[]> {
    return this.get<Product[]>('/products/search', { params: { q: query } })
  }

  public async createProduct(data: Product): Promise<Product> {
    return this.post<Product>('/products', data)
  }

  public async updateProduct(id: number, data: Product): Promise<Product> {
    return this.put<Product>(`/products/${id}`, data)
  }

  public async deleteProduct(id: number): Promise<void> {
    await this.delete(`/products/${id}`)
  }

  public async uploadProductImage(productId: number, file: File): Promise<Product> {
    return this.uploadFile<Product>(`/products/${productId}/images`, file)
  }

  // Category operations
  public async getCategories(): Promise<Category[]> {
    return this.get<Category[]>('/categories')
  }

  public async getCategory(slug: string): Promise<Category> {
    return this.get<Category>(`/categories/${slug}`)
  }

  public async createCategory(data: Partial<Category>): Promise<Category> {
    return this.post<Category>('/categories', data)
  }

  public async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    return this.put<Category>(`/categories/${id}`, data)
  }

  public async deleteCategory(id: number): Promise<void> {
    await this.delete(`/categories/${id}`)
  }
}

export const productService = ProductService.getInstance()