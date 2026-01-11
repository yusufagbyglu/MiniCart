import api from "@/src/lib/axios";
import { Coupon } from "@/src/types/coupon";
import { ApiResponse } from "@/src/types/api";

export const CouponService = {
    getAvailable: async (): Promise<Coupon[]> => {
        const response = await api.get<ApiResponse<Coupon[]>>("/coupons/available");
        return response.data.data;
    },
};
