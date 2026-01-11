"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { formatPrice } from "@/lib/currency-formatter"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart()
  const { isInWishlist, toggleWishlist, isLoading: isWishlistLoading } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ product_id: product.id, quantity: 1 })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <Card className={cn("group overflow-hidden", className)}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">📦</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && <Badge className="bg-primary">Featured</Badge>}
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            {isLowStock && !isOutOfStock && (
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
              inWishlist && "opacity-100",
            )}
            onClick={handleToggleWishlist}
            disabled={isWishlistLoading}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current text-destructive")} />
          </Button>

          {/* Quick Add */}
          {!isOutOfStock && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button className="w-full" onClick={handleAddToCart} disabled={isAddingItem}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>

            {product.category && <p className="text-xs text-muted-foreground">{product.category.name}</p>}

            {/* Rating */}
            {product.average_rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-warning text-warning" />
                <span className="text-xs font-medium">{product.average_rating.toFixed(1)}</span>
                {product.review_count !== undefined && (
                  <span className="text-xs text-muted-foreground">({product.review_count})</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="font-semibold text-lg">{formatPrice(product.price, product.base_currency)}</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
