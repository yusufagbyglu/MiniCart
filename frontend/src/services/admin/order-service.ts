import { BaseService } from '../base-service'

class AdminOrderService extends BaseService {
    private static instance: AdminOrderService

    private constructor() {
        super()
    }

    public static getInstance(): AdminOrderService {
        if (!AdminOrderService.instance) {
            AdminOrderService.instance = new AdminOrderService()
        }
        return AdminOrderService.instance
    }

    public async getOrders(params?: any): Promise<any> {
        return this.get('/admin/orders', { params })
    }

    public async getOrder(id: number | string): Promise<any> {
        return this.get(`/admin/orders/${id}`)
    }

    public async updateOrderStatus(id: number | string, status: string): Promise<any> {
        return this.put(`/admin/orders/${id}/status`, { status })
    }

    public async getOrderStats(): Promise<any> {
        return this.get('/admin/orders/stats')
    }
}

export const adminOrderService = AdminOrderService.getInstance()
