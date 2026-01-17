import { BaseService } from '../base-service'
import { PaginatedResponse } from '@/types/api'

class AdminUserService extends BaseService {
    private static instance: AdminUserService

    private constructor() {
        super()
    }

    public static getInstance(): AdminUserService {
        if (!AdminUserService.instance) {
            AdminUserService.instance = new AdminUserService()
        }
        return AdminUserService.instance
    }

    public async getUsers(params?: any): Promise<PaginatedResponse<any>> {
        return this.getPaginated<any>('/admin/users', { params })
    }

    public async getUser(id: number): Promise<any> {
        return this.get(`/admin/users/${id}`)
    }

    public async createUser(data: any): Promise<any> {
        return this.post('/admin/users', data)
    }

    public async updateUser(id: number, data: any): Promise<any> {
        return this.put(`/admin/users/${id}`, data)
    }

    public async deleteUser(id: number): Promise<void> {
        await this.delete(`/admin/users/${id}`)
    }

    public async assignRole(userId: number, roleName: string): Promise<any> {
        return this.post(`/admin/users/${userId}/roles`, { role: roleName })
    }

    public async removeRole(userId: number, roleName: string): Promise<any> {
        return this.delete(`/admin/users/${userId}/roles/${roleName}`)
    }
}

export const adminUserService = AdminUserService.getInstance()
