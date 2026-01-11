"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCartStore } from "@/store/cart-store"
import { CartService } from "@/services/cart-service"
import { useToast } from "@/hooks/use-toast"
import type { AddToCartData } from "@/types/cart"

export function useCart() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { cart, setCart, isOpen, setOpen, toggleCart, getItemCount, getSubtotal } = useCartStore()

  // Fetch cart
  const { isLoading, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.getCart,
    staleTime: 1000 * 60,
  })

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: AddToCartData) => CartService.addItem(data),
    onSuccess: (data) => {
      setCart(data)
      queryClient.setQueryData(["cart"], data)
      toast({ title: "Added to cart", description: "Item has been added to your cart." })
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    },
  })

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      CartService.updateItem(itemId, { quantity }),
    onSuccess: (data) => {
      setCart(data)
      queryClient.setQueryData(["cart"], data)
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    },
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => CartService.removeItem(itemId),
    onSuccess: (data) => {
      setCart(data)
      queryClient.setQueryData(["cart"], data)
      toast({ title: "Removed", description: "Item removed from cart." })
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    },
  })

  // Apply coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => CartService.applyCoupon(code),
    onSuccess: (data) => {
      setCart(data)
      queryClient.setQueryData(["cart"], data)
      toast({ title: "Coupon applied!", description: "Discount has been applied to your order." })
    },
    onError: (error: Error) => {
      toast({ title: "Invalid coupon", description: error.message, variant: "destructive" })
    },
  })

  // Remove coupon mutation
  const removeCouponMutation = useMutation({
    mutationFn: CartService.removeCoupon,
    onSuccess: (data) => {
      setCart(data)
      queryClient.setQueryData(["cart"], data)
      toast({ title: "Coupon removed" })
    },
  })

  const addItem = useCallback((data: AddToCartData) => addItemMutation.mutate(data), [addItemMutation])

  const updateItem = useCallback(
    (itemId: number, quantity: number) => updateItemMutation.mutate({ itemId, quantity }),
    [updateItemMutation],
  )

  const removeItem = useCallback((itemId: number) => removeItemMutation.mutate(itemId), [removeItemMutation])

  const applyCoupon = useCallback((code: string) => applyCouponMutation.mutate(code), [applyCouponMutation])

  const removeCoupon = useCallback(() => removeCouponMutation.mutate(), [removeCouponMutation])

  return {
    cart,
    isLoading,
    isOpen,
    setOpen,
    toggleCart,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    addItem,
    updateItem,
    removeItem,
    applyCoupon,
    removeCoupon,
    isAddingItem: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    refetch,
  }
}
