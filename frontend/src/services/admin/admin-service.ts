import { BaseService } from '../base-service'
import { PaginatedResponse } from '@/types/api'

class AdminService extends BaseService {
    private static instance: AdminService

    private constructor() {
        super()
    }

    public static getInstance(): AdminService {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService()
        }
        return AdminService.instance
    }

    // Coupon Management
    public async getCoupons(params?: any): Promise<PaginatedResponse<any>> {
        return this.getPaginated<any>('/admin/coupons', { params })
    }

    public async createCoupon(data: any): Promise<any> {
        return this.post('/admin/coupons', data)
    }

    public async updateCoupon(id: number, data: any): Promise<any> {
        return this.put(`/admin/coupons/${id}`, data)
    }

    public async deleteCoupon(id: number): Promise<void> {
        await this.delete(`/admin/coupons/${id}`)
    }

    // Tax Rate Management
    public async getTaxRates(params?: any): Promise<PaginatedResponse<any>> {
        return this.getPaginated<any>('/admin/tax-rates', { params })
    }

    public async createTaxRate(data: any): Promise<any> {
        return this.post('/admin/tax-rates', data)
    }

    public async updateTaxRate(id: number, data: any): Promise<any> {
        return this.put(`/admin/tax-rates/${id}`, data)
    }

    public async deleteTaxRate(id: number): Promise<void> {
        await this.delete(`/admin/tax-rates/${id}`)
    }

    // Role Management
    public async getRoles(params?: any): Promise<PaginatedResponse<any>> {
        return this.getPaginated<any>('/admin/roles', { params })
    }

    public async createRole(data: any): Promise<any> {
        return this.post('/admin/roles', data)
    }

    public async updateRole(id: number, data: any): Promise<any> {
        return this.put(`/admin/roles/${id}`, data)
    }

    public async deleteRole(id: number): Promise<void> {
        await this.delete(`/admin/roles/${id}`)
    }
}

export const adminService = AdminService.getInstance()
