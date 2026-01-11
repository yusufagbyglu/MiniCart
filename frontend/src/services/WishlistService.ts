import api from "@/src/lib/axios";
import { Wishlist } from "@/src/types/wishlist";
import { ApiResponse } from "@/src/types/api";

export const WishlistService = {
    getWishlist: async (): Promise<Wishlist> => {
        const response = await api.get<ApiResponse<Wishlist>>("/wishlist");
        return response.data.data;
    },
};
