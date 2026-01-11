export type NotificationType = "order" | "payment" | "system" | "promotion"

export interface Notification {
  id: number
  user_id: number
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  is_read: boolean
  read_at: string | null
  created_at: string
}
