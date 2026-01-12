// src/services/base-service.ts
import { ApiResponse } from '@/types/api'
import { api } from '@/lib/axios'

export class BaseService {
  protected async get<T>(url: string, config = {}): Promise<T> {
    const response = await api.get<ApiResponse<T>>(url, config)
    return response.data.data
  }

  protected async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  protected async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await api.put<ApiResponse<T>>(url, data, config)
    return response.data.data
  }

  protected async delete<T>(url: string, config = {}): Promise<void> {
    await api.delete(url, config)
  }
}