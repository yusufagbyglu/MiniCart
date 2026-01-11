import api from "@/lib/axios"
import type { Product, ProductFilters, Category } from "@/types/product"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

export const ProductService = {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>("/products", { params: filters })
    return response.data
  },

  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>("/products/search", {
      params: { search: query, ...filters },
    })
    return response.data
  },

  async getProduct(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}`)
    return response.data.data
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories")
    return response.data.data
  },

  async getCategory(slug: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${slug}`)
    return response.data.data
  },

  async getCategoryProducts(slug: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(`/categories/${slug}/products`, {
      params: filters,
    })
    return response.data
  },

  // Admin endpoints
  async createProduct(data: FormData): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  },

  async updateProduct(id: number, data: FormData): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data.data
  },

  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async uploadProductImage(productId: number, image: File): Promise<void> {
    const formData = new FormData()
    formData.append("image", image)
    await api.post(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`)
  },
}
