"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Check, CreditCard, Building, ShoppingBag, ChevronLeft, Lock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import { useUserStore } from "@/store/user-store"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/currency-formatter"
import { AddressCard } from "@/components/address/address-card"
import { AddressForm } from "@/components/address/address-form"
import type { UserAddress } from "@/types/address"
import type { PaymentMethod } from "@/types/order"

// Mock addresses
const mockAddresses: UserAddress[] = [
  {
    id: 1,
    user_id: 1,
    address_type: "shipping",
    full_name: "John Doe",
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "New York",
    state: "NY",
    country: "United States",
    postal_code: "10001",
    phone: "+1 (555) 123-4567",
    is_default: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 2,
    user_id: 1,
    address_type: "billing",
    full_name: "John Doe",
    address_line1: "456 Office Park",
    address_line2: "Suite 200",
    city: "New York",
    state: "NY",
    country: "United States",
    postal_code: "10002",
    phone: "+1 (555) 987-6543",
    is_default: false,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

const paymentMethods: { id: PaymentMethod; name: string; icon: React.ElementType; description: string }[] = [
  { id: "credit_card", name: "Credit Card", icon: CreditCard, description: "Pay with Visa, Mastercard, or Amex" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Building, description: "Direct bank transfer" },
  { id: "fake", name: "Test Payment", icon: CreditCard, description: "For testing purposes only" },
]

type CheckoutStep = "shipping" | "payment" | "review"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart } = useCartStore()
  const { isAuthenticated } = useUserStore()

  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(
    mockAddresses.find((a) => a.is_default && a.address_type === "shipping")?.id || null,
  )
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null)
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  const isEmpty = !cart || cart.items.length === 0

  const shippingAddresses = mockAddresses.filter((a) => a.address_type === "shipping")
  const billingAddresses = mockAddresses.filter((a) => a.address_type === "billing")
  const selectedShippingAddress = mockAddresses.find((a) => a.id === shippingAddressId)
  const selectedBillingAddress = sameAsShipping
    ? selectedShippingAddress
    : mockAddresses.find((a) => a.id === billingAddressId)

  const handlePlaceOrder = async () => {
    if (!shippingAddressId) {
      toast({
        title: "Shipping address required",
        description: "Please select a shipping address",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Order placed successfully!",
      description: "You will receive a confirmation email shortly.",
    })

    // In production, this would redirect to order confirmation page
    router.push("/dashboard/orders")
    setIsProcessing(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Lock className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign in to checkout</h1>
          <p className="text-muted-foreground mb-6">Please sign in to your account to complete your purchase.</p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/login?redirect=/checkout">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register?redirect=/checkout">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "shipping", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-2 ${
                index <= currentStepIndex ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStepIndex
                    ? "bg-primary text-primary-foreground"
                    : index === currentStepIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                }`}
              >
                {index < currentStepIndex ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="font-medium hidden sm:inline">{s.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-24 h-0.5 mx-2 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Step */}
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Select where you want your order delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showNewAddressForm ? (
                  <div className="space-y-4">
                    <AddressForm
                      onSubmit={(data) => {
                        // In production, this would create the address via API
                        console.log("New address:", data)
                        setShowNewAddressForm(false)
                        toast({ title: "Address added" })
                      }}
                      onCancel={() => setShowNewAddressForm(false)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {shippingAddresses.map((address) => (
                        <AddressCard
                          key={address.id}
                          address={address}
                          selectable
                          selected={shippingAddressId === address.id}
                          onSelect={() => setShippingAddressId(address.id)}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setShowNewAddressForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>

                    <Separator />

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="same-as-shipping"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="same-as-shipping">Billing address same as shipping</Label>
                    </div>

                    {!sameAsShipping && (
                      <div className="space-y-3 mt-4">
                        <h3 className="font-medium">Billing Address</h3>
                        {billingAddresses.map((address) => (
                          <AddressCard
                            key={address.id}
                            address={address}
                            selectable
                            selected={billingAddressId === address.id}
                            onSelect={() => setBillingAddressId(address.id)}
                          />
                        ))}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setStep("payment")}
                      disabled={!shippingAddressId}
                    >
                      Continue to Payment
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you want to pay</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                        paymentMethod === method.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep("shipping")}>
                    Back
                  </Button>
                  <Button className="flex-1" size="lg" onClick={() => setStep("review")}>
                    Review Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="space-y-6">
              {/* Addresses Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h4>
                      {selectedShippingAddress && (
                        <div className="text-sm">
                          <p className="font-medium">{selectedShippingAddress.full_name}</p>
                          <p>{selectedShippingAddress.address_line1}</p>
                          {selectedShippingAddress.address_line2 && <p>{selectedShippingAddress.address_line2}</p>}
                          <p>
                            {selectedShippingAddress.city}, {selectedShippingAddress.state}{" "}
                            {selectedShippingAddress.postal_code}
                          </p>
                          <p>{selectedShippingAddress.country}</p>
                        </div>
                      )}
                      <Button variant="link" className="h-auto p-0 mt-2" onClick={() => setStep("shipping")}>
                        Edit
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Billing Address</h4>
                      {selectedBillingAddress && (
                        <div className="text-sm">
                          <p className="font-medium">{selectedBillingAddress.full_name}</p>
                          <p>{selectedBillingAddress.address_line1}</p>
                          {selectedBillingAddress.address_line2 && <p>{selectedBillingAddress.address_line2}</p>}
                          <p>
                            {selectedBillingAddress.city}, {selectedBillingAddress.state}{" "}
                            {selectedBillingAddress.postal_code}
                          </p>
                          <p>{selectedBillingAddress.country}</p>
                        </div>
                      )}
                      <Button variant="link" className="h-auto p-0 mt-2" onClick={() => setStep("shipping")}>
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    {(() => {
                      const method = paymentMethods.find((m) => m.id === paymentMethod)
                      if (method) {
                        return (
                          <>
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                              <method.icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </>
                        )
                      }
                      return null
                    })()}
                  </div>
                  <Button variant="link" className="h-auto p-0 mt-2" onClick={() => setStep("payment")}>
                    Edit
                  </Button>
                </CardContent>
              </Card>

              {/* Items Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart?.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].url || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.total)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment")}>
                  Back
                </Button>
                <Button className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    "Processing..."
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order - {formatPrice(cart?.total ?? 0)}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Preview */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
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
                  <span>{formatPrice(cart?.subtotal ?? 0)}</span>
                </div>
                {cart?.coupon && (
                  <div className="flex items-center justify-between text-sm text-accent">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.coupon.discount_amount)}</span>
                  </div>
                )}
                {cart?.tax_amount !== undefined && cart.tax_amount > 0 && (
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
                <span>{formatPrice(cart?.total ?? 0)}</span>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                <Lock className="h-3 w-3 inline mr-1" />
                Secure checkout powered by MiniCart
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
