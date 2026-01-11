"use client"

import { useState, useEffect } from "react"
import { Plus, MapPin, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddressForm } from "@/components/address/address-form"
import { useToast } from "@/hooks/use-toast"
import { addressApi } from "@/lib/api/address"
import type { Address } from "@/types/address"

export default function AddressesPage() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const response = await addressApi.getAddresses()
      setAddresses(response.addresses)
    } catch (error) {
      console.error("Failed to load addresses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: Partial<Address>) => {
    try {
      if (editingAddress) {
        await addressApi.updateAddress(editingAddress.id, data)
        toast({ title: "Address updated", description: "Your address has been updated successfully." })
      } else {
        await addressApi.createAddress(data)
        toast({ title: "Address added", description: "Your new address has been added successfully." })
      }
      loadAddresses()
      setIsDialogOpen(false)
      setEditingAddress(null)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save address. Please try again.", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await addressApi.deleteAddress(deletingId)
      toast({ title: "Address deleted", description: "Your address has been deleted successfully." })
      loadAddresses()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete address. Please try again.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await addressApi.setDefaultAddress(id)
      toast({ title: "Default address updated" })
      loadAddresses()
    } catch (error) {
      toast({ title: "Error", description: "Failed to set default address.", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAddress(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress || undefined}
              onSubmit={handleSave}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No addresses yet</h3>
            <p className="mb-4 text-center text-muted-foreground">Add a shipping address to make checkout faster</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`relative overflow-hidden transition-shadow hover:shadow-md ${address.isDefault ? "ring-2 ring-primary" : ""}`}
            >
              {address.isDefault && (
                <div className="absolute right-0 top-0 bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Default
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{address.label || "Address"}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-muted-foreground">{address.addressLine2}</p>}
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.country}</p>
                  {address.phone && <p className="mt-2 text-sm text-muted-foreground">{address.phone}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAddress(address)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                      <Star className="mr-1 h-3 w-3" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 bg-transparent"
                    onClick={() => setDeletingId(address.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
