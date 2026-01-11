import api from "@/src/lib/axios";
import { Notification } from "@/src/types/notification";
import { ApiResponse } from "@/src/types/api";

export const NotificationService = {
    getAll: async (): Promise<Notification[]> => {
        const response = await api.get<ApiResponse<Notification[]>>("/notifications");
        return response.data.data;
    },
};
