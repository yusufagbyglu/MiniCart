import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Truck, Shield, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/product/product-card"

// Mock data - in production this would come from API
const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-fidelity audio with noise cancellation",
    price: 299.99,
    base_currency: "USD",
    stock: 25,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "WH-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: true,
    sales_count: 150,
    images: [
      { id: 1, product_id: 1, url: "/premium-wireless-headphones.png", alt_text: "Premium Headphones", sort_order: 0 },
    ],
    average_rating: 4.8,
    review_count: 124,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Minimalist Leather Watch",
    slug: "minimalist-leather-watch",
    description: "Elegant timepiece with genuine leather strap",
    price: 189.99,
    base_currency: "USD",
    stock: 42,
    category_id: 2,
    category: { id: 2, name: "Accessories", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "LW-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: true,
    sales_count: 89,
    images: [{ id: 2, product_id: 2, url: "/minimalist-leather-watch.jpg", alt_text: "Leather Watch", sort_order: 0 }],
    average_rating: 4.6,
    review_count: 67,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 3,
    name: "Smart Home Speaker",
    slug: "smart-home-speaker",
    description: "Voice-controlled speaker with premium sound",
    price: 149.99,
    base_currency: "USD",
    stock: 3,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "SH-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: true,
    sales_count: 234,
    images: [{ id: 3, product_id: 3, url: "/smart-home-speaker.png", alt_text: "Smart Speaker", sort_order: 0 }],
    average_rating: 4.5,
    review_count: 189,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 4,
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    description: "Premium comfort for long work sessions",
    price: 449.99,
    base_currency: "USD",
    stock: 18,
    category_id: 3,
    category: { id: 3, name: "Furniture", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "EC-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: true,
    sales_count: 56,
    images: [{ id: 4, product_id: 4, url: "/ergonomic-office-chair.png", alt_text: "Office Chair", sort_order: 0 }],
    average_rating: 4.9,
    review_count: 42,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

const categories = [
  { id: 1, name: "Electronics", slug: "electronics", image: "/electronics-category.png", count: 124 },
  { id: 2, name: "Accessories", slug: "accessories", image: "/accessories-category.png", count: 89 },
  { id: 3, name: "Furniture", slug: "furniture", image: "/furniture-category.png", count: 56 },
  { id: 4, name: "Clothing", slug: "clothing", image: "/diverse-clothing-category.png", count: 203 },
]

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
  { icon: Shield, title: "Secure Payment", description: "100% protected checkout" },
  { icon: CreditCard, title: "Easy Returns", description: "30-day return policy" },
  { icon: Sparkles, title: "Premium Quality", description: "Curated products only" },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                New Collection 2026
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Discover Premium Products for <span className="text-primary">Modern Living</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg text-pretty">
                Explore our curated collection of high-quality products designed to elevate your everyday experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted">
                <Image src="/premium-lifestyle-products-hero-image.jpg" alt="Premium products" fill className="object-cover" priority />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold">500+ Products</p>
                    <p className="text-sm text-muted-foreground">Premium selection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-1">Find what you need in our collections</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/categories">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="group">
              <Card className="overflow-hidden h-full">
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} products</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 border-t">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-1">Our most popular items this season</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products?featured=true">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-balance">Get 20% Off Your First Order</h2>
                <p className="text-primary-foreground/80">
                  Sign up for our newsletter and receive an exclusive discount code.
                </p>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/register">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="hidden md:block relative aspect-video rounded-lg overflow-hidden">
                <Image src="/special-offer-promotion.jpg" alt="Special offer" fill className="object-cover" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
