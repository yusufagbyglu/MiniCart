import api from "@/src/lib/axios";
import { Order, CheckoutFormData } from "@/src/types/order";
import { ApiResponse, PaginatedResponse } from "@/src/types/api";

export const OrderService = {
    // Create order (checkout)
    createOrder: async (data: CheckoutFormData): Promise<Order> => {
        const response = await api.post<ApiResponse<Order>>("/orders", data);
        return response.data.data;
    },

    // Get all orders for current user
    getMyOrders: async (page: number = 1): Promise<PaginatedResponse<Order>> => {
        const response = await api.get<PaginatedResponse<Order>>("/orders", {
            params: { page }
        });
        return response.data;
    },

    // Get single order by ID
    getOrder: async (id: number): Promise<Order> => {
        const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
        return response.data.data;
    },

    // Cancel order
    cancelOrder: async (id: number): Promise<Order> => {
        const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
        return response.data.data;
    },

    // Admin: Get all orders
    getAllOrders: async (page: number = 1, status?: string): Promise<PaginatedResponse<Order>> => {
        const response = await api.get<PaginatedResponse<Order>>("/admin/orders", {
            params: { page, status }
        });
        return response.data;
    },

    // Admin: Update order status
    updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
        const response = await api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status });
        return response.data.data;
    },
};
