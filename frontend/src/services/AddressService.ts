import api from "@/src/lib/axios";
import { Address } from "@/src/types/address";
import { ApiResponse } from "@/src/types/api";

export const AddressService = {
    getAll: async (): Promise<Address[]> => {
        const response = await api.get<ApiResponse<Address[]>>("/addresses");
        return response.data.data;
    },
};
