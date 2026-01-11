import type React from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
// import { Providers } from "@/components/providers"
import { Providers } from "@/components/providers"
import { CartDrawer } from "@/components/cart/cart-drawer"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </Providers>
  )
}
