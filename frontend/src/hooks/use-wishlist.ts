"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useWishlistStore } from "@/store/wishlist-store"
import { wishlistService } from "@/services/wishlist-service"
import { useUserStore } from "@/store/user-store"
import { useToast } from "@/hooks/use-toast"

export function useWishlist() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { isAuthenticated } = useUserStore()
  const { items, setItems, addItem, removeItem, isInWishlist, getCount } = useWishlistStore()

  // Fetch wishlist
  useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })

  // Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: (productId: number) => wishlistService.addToWishlist(productId),
    onSuccess: () => {
      // Since we don't get the item back from the API, we'll just invalidate the query
      // which will trigger a refetch of the wishlist
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
      toast({ title: "Added to wishlist" })
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    },
  })

  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: (productId: number) => wishlistService.removeFromWishlist(productId),
    onSuccess: (_, productId) => {
      removeItem(productId)
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
      toast({ title: "Removed from wishlist" })
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    },
  })

  const toggleWishlist = useCallback(
    (productId: number) => {
      if (!isAuthenticated) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your wishlist.",
          variant: "destructive",
        })
        return
      }

      if (isInWishlist(productId)) {
        removeMutation.mutate(productId)
      } else {
        addMutation.mutate(productId)
      }
    },
    [isAuthenticated, isInWishlist, addMutation, removeMutation, toast],
  )

  return {
    items,
    count: getCount(),
    isInWishlist,
    toggleWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  }
}
