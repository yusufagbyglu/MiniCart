import api from "@/src/lib/axios";
import { User } from "@/src/types/user";
import { ApiResponse } from "@/src/types/api";

export const UserService = {
    getProfile: async (): Promise<User> => {
        const response = await api.get<ApiResponse<User>>("/user/profile");
        return response.data.data;
    },
};
