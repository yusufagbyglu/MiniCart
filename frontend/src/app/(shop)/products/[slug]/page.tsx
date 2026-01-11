"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/currency-formatter"
import { WishlistButton } from "@/components/wishlist/wishlist-button"
import { StockBadge } from "@/components/product/stock-badge"
import { RatingStars } from "@/components/review/rating-stars"
import { ProductCard } from "@/components/product/product-card"
import { ReviewList } from "@/components/review/review-list"
import { ReviewForm } from "@/components/review/review-form"

// Mock product data - in production this would come from API
const getProduct = (slug: string) => ({
  id: 1,
  name: "Premium Wireless Headphones",
  slug: slug,
  description:
    "Experience unparalleled audio quality with our Premium Wireless Headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear sound for music, calls, and gaming. The comfortable over-ear design with memory foam cushions ensures extended listening comfort.",
  price: 299.99,
  base_currency: "USD",
  stock: 25,
  category_id: 1,
  category: { id: 1, name: "Electronics", description: null, parent_id: null },
  tax_class_id: 1,
  is_active: true,
  sku: "WH-001",
  weight: 0.28,
  length: null,
  width: null,
  height: null,
  featured: true,
  sales_count: 150,
  images: [
    {
      id: 1,
      product_id: 1,
      url: "/premium-wireless-headphones.png",
      alt_text: "Premium Headphones Front",
      sort_order: 0,
    },
    { id: 2, product_id: 1, url: "/premium-headphones-side.png", alt_text: "Premium Headphones Side", sort_order: 1 },
    { id: 3, product_id: 1, url: "/premium-headphones-detail.jpg", alt_text: "Premium Headphones Detail", sort_order: 2 },
    { id: 4, product_id: 1, url: "/premium-headphones-case.jpg", alt_text: "Premium Headphones Case", sort_order: 3 },
  ],
  average_rating: 4.8,
  review_count: 124,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
})

const relatedProducts = [
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
    id: 5,
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Waterproof speaker with 20-hour battery",
    price: 79.99,
    base_currency: "USD",
    stock: 67,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "BS-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: false,
    sales_count: 312,
    images: [{ id: 5, product_id: 5, url: "/portable-bluetooth-speaker.jpg", alt_text: "Bluetooth Speaker", sort_order: 0 }],
    average_rating: 4.3,
    review_count: 256,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 8,
    name: "Wireless Earbuds Pro",
    slug: "wireless-earbuds-pro",
    description: "True wireless with active noise cancellation",
    price: 199.99,
    base_currency: "USD",
    stock: 45,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "WE-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: false,
    sales_count: 423,
    images: [{ id: 8, product_id: 8, url: "/wireless-earbuds-pro-white.jpg", alt_text: "Wireless Earbuds", sort_order: 0 }],
    average_rating: 4.6,
    review_count: 312,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
  {
    id: 9,
    name: "USB-C Hub Adapter",
    slug: "usb-c-hub-adapter",
    description: "7-in-1 multiport adapter for laptops",
    price: 49.99,
    base_currency: "USD",
    stock: 120,
    category_id: 1,
    category: { id: 1, name: "Electronics", description: null, parent_id: null },
    tax_class_id: 1,
    is_active: true,
    sku: "UH-001",
    weight: null,
    length: null,
    width: null,
    height: null,
    featured: false,
    sales_count: 567,
    images: [{ id: 9, product_id: 9, url: "/usb-c-hub-adapter-silver.jpg", alt_text: "USB-C Hub", sort_order: 0 }],
    average_rating: 4.4,
    review_count: 423,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  },
]

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $100" },
  { icon: Shield, title: "2 Year Warranty", description: "Full coverage" },
  { icon: RotateCcw, title: "30-Day Returns", description: "Easy returns" },
]

export default function ProductDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const { addItem, isAddingItem } = useCart()

  const product = getProduct(params.slug as string)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const isOutOfStock = product.stock <= 0
  const maxQuantity = Math.min(product.stock, 10)

  const handleAddToCart = () => {
    addItem({ product_id: product.id, quantity })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: "Link copied to clipboard" })
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">
          Products
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category?.name.toLowerCase()}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category?.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={product.images[selectedImage]?.url || "/placeholder.svg"}
              alt={product.images[selectedImage]?.alt_text || product.name}
              fill
              className="object-cover"
              priority
            />
            {product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {product.featured && <Badge className="absolute top-4 left-4">Featured</Badge>}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt_text || `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <RatingStars rating={product.average_rating || 0} />
              <span className="text-sm font-medium">{product.average_rating?.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.review_count} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price, product.base_currency)}</span>
            <StockBadge stock={product.stock} />
          </div>

          <Separator />

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity & Add to Cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={isAddingItem}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <WishlistButton productId={product.id} />
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="space-y-4">
              <p className="text-destructive font-medium">This product is currently out of stock</p>
              <div className="flex gap-3">
                <WishlistButton productId={product.id} variant="default" className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="h-10 w-10 mx-auto rounded-lg bg-muted flex items-center justify-center mb-2">
                  <feature.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* SKU */}
          <p className="text-sm text-muted-foreground">
            SKU: <span className="font-mono">{product.sku}</span>
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="details" className="mt-12">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.review_count})</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <div className="prose prose-slate max-w-none">
            <h3>Product Details</h3>
            <p>{product.description}</p>
            <h4>Specifications</h4>
            <ul>
              <li>SKU: {product.sku}</li>
              {product.weight && <li>Weight: {product.weight} kg</li>}
              <li>Category: {product.category?.name}</li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewList productId={product.id} />
            </div>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
