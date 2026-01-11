"use client"

import { useState } from "react"
import { Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/currency-formatter"
import type { AppliedCoupon } from "@/types/cart"

interface CouponInputProps {
  appliedCoupon?: AppliedCoupon | null
}

export function CouponInput({ appliedCoupon }: CouponInputProps) {
  const { applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    setIsApplying(true)
    await applyCoupon(code)
    setCode("")
    setIsApplying(false)
  }

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">{appliedCoupon.code}</span>
          <span className="text-sm text-accent">-{formatPrice(appliedCoupon.discount_amount)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={removeCoupon}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
      <Button variant="outline" onClick={handleApply} disabled={isApplying || !code.trim()}>
        {isApplying ? "..." : "Apply"}
      </Button>
    </div>
  )
}
