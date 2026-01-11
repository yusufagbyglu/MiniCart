import api from "@/src/lib/axios";
import { Category } from "@/src/types/product";
import { ApiResponse } from "@/src/types/api";

export const CategoryService = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<ApiResponse<Category[]>>("/categories");
        return response.data.data;
    },
};
