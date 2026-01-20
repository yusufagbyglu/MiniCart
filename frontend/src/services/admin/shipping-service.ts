import { BaseService } from '../base-service'

export interface ShippingDetail {
    id?: number
    order_id: number
    tracking_number: string
    shipped_at: string
    delivered_at?: string
    carrier: string
    shipping_cost: number
}

class AdminShippingService extends BaseService {
    private static instance: AdminShippingService

    private constructor() {
        super()
    }

    public static getInstance(): AdminShippingService {
        if (!AdminShippingService.instance) {
            AdminShippingService.instance = new AdminShippingService()
        }
        return AdminShippingService.instance
    }

    public async updateShipping(orderId: number, data: Partial<ShippingDetail>): Promise<ShippingDetail> {
        return this.post<ShippingDetail>(`/admin/orders/${orderId}/shipping`, data)
    }

    public async markAsDelivered(orderId: number): Promise<{ message: string }> {
        return this.post<{ message: string }>(`/admin/orders/${orderId}/shipping/delivered`, {})
    }
}

export const adminShippingService = AdminShippingService.getInstance()
