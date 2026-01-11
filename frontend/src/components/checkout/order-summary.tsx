"use client"

import Image from "next/image"
import { ShoppingBag, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/currency-formatter"
import type { Cart } from "@/types/cart"

interface OrderSummaryProps {
  cart: Cart
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                {item.product.images?.[0] ? (
                  <Image
                    src={item.product.images[0].url || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.total)}</p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>
          {cart.coupon && (
            <div className="flex items-center justify-between text-sm text-accent">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {cart.coupon.code}
              </span>
              <span>-{formatPrice(cart.coupon.discount_amount)}</span>
            </div>
          )}
          {cart.tax_amount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(cart.tax_amount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-accent">Free</span>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
