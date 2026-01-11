import api from "@/src/lib/axios";
import { Review } from "@/src/types/review";
import { ApiResponse } from "@/src/types/api";

export const ReviewService = {
    getByProduct: async (productId: number): Promise<Review[]> => {
        const response = await api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`);
        return response.data.data;
    },
};
