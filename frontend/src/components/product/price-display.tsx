import { formatPrice } from "@/lib/currency-formatter"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  currency?: string
  originalPrice?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function PriceDisplay({ price, currency = "USD", originalPrice, size = "md", className }: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-semibold", sizeClasses[size])}>{formatPrice(price, currency)}</span>
      {hasDiscount && (
        <>
          <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-base" : "text-sm")}>
            {formatPrice(originalPrice, currency)}
          </span>
          <span className="text-xs font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded">
            -{discountPercentage}%
          </span>
        </>
      )}
    </div>
  )
}
