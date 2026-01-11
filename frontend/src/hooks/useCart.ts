"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/src/services/CartService";
import type { Cart } from "@/src/types/cart";
import { toast } from "@/src/hooks/useToast";

// Query keys
export const cartKeys = {
    all: ['cart'] as const,
    detail: (guestId?: string) => [...cartKeys.all, guestId] as const,
};

// Get guest identifier
function getGuestId(): string {
    if (typeof window === "undefined") return "";

    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("guest_id", guestId);
    }
    return guestId;
}

// Get cart
export function useCart() {
    const guestId = getGuestId();

    return useQuery({
        queryKey: cartKeys.detail(guestId),
        queryFn: () => CartService.getCart(guestId),
        staleTime: 30 * 1000, // 30 seconds
        retry: 1,
    });
}

// Add item to cart
export function useAddToCart() {
    const queryClient = useQueryClient();
    const guestId = getGuestId();

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
            CartService.addItem(productId, quantity, guestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            toast({
                title: "Added to cart",
                description: "Item has been added to your cart successfully.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to add item to cart",
                variant: "destructive",
            });
        },
    });
}

// Update cart item
export function useUpdateCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            CartService.updateItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update cart",
                variant: "destructive",
            });
        },
    });
}

// Remove cart item
export function useRemoveCartItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: number) => CartService.removeItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            toast({
                title: "Removed from cart",
                description: "Item has been removed from your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to remove item",
                variant: "destructive",
            });
        },
    });
}

// Apply coupon
export function useApplyCoupon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (code: string) => CartService.applyCoupon(code),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.all });
            toast({
                title: "Coupon applied",
                description: "Discount has been applied to your cart.",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Invalid coupon",
                description: error.response?.data?.message || "This coupon code is not valid",
                variant: "destructive",
            });
        },
    });
}
