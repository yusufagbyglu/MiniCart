import { BaseService } from '../base-service'
import { PaginatedResponse } from '@/types/api'
import { Payment, Refund, PaymentStats } from '@/types/payment'

class AdminPaymentService extends BaseService {
    private static instance: AdminPaymentService

    private constructor() {
        super()
    }

    public static getInstance(): AdminPaymentService {
        if (!AdminPaymentService.instance) {
            AdminPaymentService.instance = new AdminPaymentService()
        }
        return AdminPaymentService.instance
    }

    public async getPayments(params?: any): Promise<PaginatedResponse<Payment>> {
        return this.getPaginated<Payment>('/admin/payments', { params })
    }

    public async getPayment(id: number | string): Promise<Payment> {
        return this.get<Payment>(`/admin/payments/${id}`)
    }

    public async getStats(): Promise<PaymentStats> {
        return this.get<PaymentStats>('/admin/payments/stats')
    }

    public async processRefund(orderId: number, data: {
        amount: number;
        reason: string;
        notes?: string;
    }): Promise<{ message: string, refund: Refund }> {
        return this.post<{ message: string, refund: Refund }>(`/admin/orders/${orderId}/refund`, data)
    }

    public async getRefunds(params?: any): Promise<PaginatedResponse<Refund>> {
        return this.getPaginated<Refund>('/admin/refunds', { params })
    }
}

export const adminPaymentService = AdminPaymentService.getInstance()
