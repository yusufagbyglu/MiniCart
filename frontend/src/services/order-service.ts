import api from "@/lib/axios"
import type { 
  Order, 
  OrderItem,
  OrderStatus, 
  PaymentMethod,
  CheckoutData,
  ShippingDetail
} from "@/types/order"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

export const OrderService = {
  async checkout(data: CheckoutData): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>("/orders/checkout", data)
    return response.data.data
  },

  async getOrders(page = 1): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>("/orders", { params: { page } })
    return response.data
  },

  async getOrder(orderNumber: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${orderNumber}`)
    return response.data.data
  },

  async cancelOrder(orderNumber: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(`/orders/${orderNumber}/cancel`)
    return response.data.data
  },

  async getUserOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>("/user/orders")
    return response.data.data
  },

  // Admin endpoints
  async getAdminOrders(filters?: { status?: OrderStatus; page?: number }): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>("/admin/orders", { params: filters })
    return response.data
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, { status })
    return response.data.data
  },

  async updateShipping(
    orderId: number, 
    data: { 
      tracking_number: string | null; 
      carrier: string | null;
      shipped_at?: string | null;
      delivered_at?: string | null;
      shipping_cost?: number;
    }
  ): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(`/admin/orders/${orderId}/shipping`, data)
    return response.data.data
  },

  async getOrderStats(): Promise<{
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    processing_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    refunded_orders: number;
    total_sales: number;
    average_order_value: number;
  }> {
    const response = await api.get<ApiResponse<{
      total_orders: number;
      total_revenue: number;
      pending_orders: number;
      processing_orders: number;
      shipped_orders: number;
      delivered_orders: number;
      cancelled_orders: number;
      refunded_orders: number;
      total_sales: number;
      average_order_value: number;
    }>>("/admin/orders/stats");
    return response.data.data;
  },

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    const response = await api.get<ApiResponse<OrderItem[]>>(`/admin/orders/${orderId}/items`);
    return response.data.data;
  }
}