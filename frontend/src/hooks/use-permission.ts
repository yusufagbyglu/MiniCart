"use client"

import { useUserStore } from "@/store/user-store"

export function usePermission() {
  const { user, hasPermission, hasRole } = useUserStore()

  const isAdmin = hasRole("admin")
  const isModerator = hasRole("moderator") || isAdmin

  return {
    user,
    isAdmin,
    isModerator,
    hasPermission,
    hasRole,
    canManageProducts: hasPermission("products.manage") || isAdmin,
    canManageOrders: hasPermission("orders.manage") || isAdmin,
    canManageUsers: hasPermission("users.manage") || isAdmin,
    canManageReviews: hasPermission("reviews.manage") || isModerator,
    canViewAuditLogs: hasPermission("audit.view") || isAdmin,
  }
}
