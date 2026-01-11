import { AlertTriangle, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StockBadgeProps {
  stock: number
  className?: string
}

export function StockBadge({ stock, className }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className={cn("gap-1", className)}>
        <X className="h-3 w-3" />
        Out of Stock
      </Badge>
    )
  }

  if (stock <= 5) {
    return (
      <Badge variant="secondary" className={cn("gap-1 bg-warning/20 text-warning-foreground", className)}>
        <AlertTriangle className="h-3 w-3" />
        Only {stock} left
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={cn("gap-1 bg-success/20 text-success-foreground", className)}>
      <Check className="h-3 w-3" />
      In Stock
    </Badge>
  )
}
