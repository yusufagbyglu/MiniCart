"use client"

import { MapPin, Phone, Check, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserAddress } from "@/types/address"

interface AddressCardProps {
  address: UserAddress
  onEdit?: () => void
  onDelete?: () => void
  selectable?: boolean
  selected?: boolean
  onSelect?: () => void
}

export function AddressCard({ address, onEdit, onDelete, selectable, selected, onSelect }: AddressCardProps) {
  return (
    <Card
      className={`relative ${selectable ? "cursor-pointer hover:border-primary transition-colors" : ""} ${selected ? "border-primary ring-1 ring-primary" : ""}`}
      onClick={selectable ? onSelect : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {selectable && (
              <div
                className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${selected ? "border-primary bg-primary" : "border-muted-foreground"}`}
              >
                {selected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{address.full_name}</p>
                {address.is_default && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {address.address_type}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {address.address_line1}
                </p>
                {address.address_line2 && <p className="pl-4">{address.address_line2}</p>}
                <p className="pl-4">
                  {address.city}, {address.state && `${address.state}, `}
                  {address.country} {address.postal_code}
                </p>
                {address.phone && (
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {address.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
