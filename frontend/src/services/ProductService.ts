import api from "@/src/lib/axios";
import { Product } from "@/src/types/product";
import { ApiResponse, PaginatedResponse } from "@/src/types/api";

export const ProductService = {
    getAll: async (): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>("/products");
        return response.data.data;
    },

    getBySlug: async (slug: string): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/products/${slug}`);
        return response.data.data;
    },

    search: async (query: string): Promise<Product[]> => {
        const response = await api.get<ApiResponse<Product[]>>(`/products/search`, {
            params: { query }
        });
        return response.data.data;
    },

    getById: async (id: number): Promise<Product> => {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data.data;
    },
};
