"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: number
  variant?: "default" | "icon"
  className?: string
}

export function WishlistButton({ productId, variant = "icon", className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const inWishlist = isInWishlist(productId)

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(className)}
        onClick={() => toggleWishlist(productId)}
        disabled={isLoading}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-current text-destructive")} />
      </Button>
    )
  }

  return (
    <Button
      variant={inWishlist ? "destructive" : "outline"}
      className={cn("gap-2", className)}
      onClick={() => toggleWishlist(productId)}
      disabled={isLoading}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  )
}
