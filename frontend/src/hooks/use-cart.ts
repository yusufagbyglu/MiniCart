"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCartStore } from "@/store/cart-store"
import { cartService } from "@/services/cart-service"
import { useToast } from "@/hooks/use-toast"
import type { AddToCartData, Cart } from "@/types/cart"

export function useCart() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { cart, setCart, isOpen, setOpen, toggleCart, getItemCount, getSubtotal } = useCartStore()

  // Fetch cart
  const { isLoading, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 1000 * 60,
  })
  
  // Update cart in store when query data changes
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 1000 * 60,
    enabled: false, // Don't fetch on mount, we already have the query above
  })
  
  // Update cart in store when query data changes
  if (cartData) {
    setCart(cartData)
  }

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: AddToCartData) => cartService.addToCart(data),
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
    mutationFn: (params: { itemId: number; quantity: number }) =>
      cartService.updateCartItem(params.itemId, params.quantity),
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
  mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
  onSuccess: () => {
    // Instead of using the response data, refetch the cart
    queryClient.invalidateQueries({ queryKey: ['cart'] })
    toast({ title: "Removed", description: "Item removed from cart." })
  },
  onError: (error: Error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" })
  },
})

  // Apply coupon mutation
  const applyCouponMutation = useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
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
    mutationFn: cartService.removeCoupon,
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
