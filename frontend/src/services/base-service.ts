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

  protected async delete<T = void>(url: string, config = {}): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(url, config)
    return response.data.data
  }

  protected async uploadFile<T>(url: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)
    return this.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
