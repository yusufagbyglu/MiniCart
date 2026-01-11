import api from "@/lib/axios"
import type { Notification } from "@/types/notification"
import type { ApiResponse } from "@/types/api"

export const NotificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>("/user/notifications")
    return response.data.data
  },

  async markAsRead(notificationId: number): Promise<Notification> {
    const response = await api.put<ApiResponse<Notification>>(`/user/notifications/${notificationId}/read`)
    return response.data.data
  },

  async markAllAsRead(): Promise<void> {
    await api.put("/user/notifications/read-all")
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>("/user/notifications/unread-count")
    return response.data.data.count
  },
}
