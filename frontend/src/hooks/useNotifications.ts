import { useNotificationStore } from "@/src/store/useNotificationStore";

export function useNotifications() {
    return useNotificationStore();
}
