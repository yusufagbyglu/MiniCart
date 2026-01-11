"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductGrid } from "@/components/product/product-grid"
import { useDebounce } from "@/hooks/use-debounce"

// Mock category data
const getCategoryData = (slug: string) => {
  const categories: Record<string, { id: number; name: string; description: string; image: string }> = {
    electronics: {
      id: 1,
      name: "Electronics",
      description: "Explore the latest gadgets and technology products",
      image: "/electronics-category.png",
    },
    accessories: {
      id: 2,
      name: "Accessories",
      description: "Complete your look with stylish accessories",
      image: "/accessories-category.png",
    },
    furniture: {
      id: 3,
      name: "Furniture",
      description: "Transform your space with quality furniture",
      image: "/furniture-category.png",
    },
    clothing: {
      id: 4,
      name: "Clothing",
      description: "Discover trendy fashion for every occasion",
      image: "/diverse-clothing-category.png",
    },
  }
  return categories[slug] || { id: 0, name: slug, description: "", image: "/placeholder.svg" }
}

// Mock products for category
const getCategoryProducts = (categoryId: number) => {
  const allProducts = [
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
        {
          id: 1,
          product_id: 1,
          url: "/premium-wireless-headphones.png",
          alt_text: "Premium Headphones",
          sort_order: 0,
        },
      ],
      average_rating: 4.8,
      review_count: 124,
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
      images: [
        { id: 5, product_id: 5, url: "/portable-bluetooth-speaker.jpg", alt_text: "Bluetooth Speaker", sort_order: 0 },
      ],
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
      images: [
        { id: 8, product_id: 8, url: "/wireless-earbuds-pro-white.jpg", alt_text: "Wireless Earbuds", sort_order: 0 },
      ],
      average_rating: 4.6,
      review_count: 312,
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
      images: [
        { id: 2, product_id: 2, url: "/minimalist-leather-watch.jpg", alt_text: "Leather Watch", sort_order: 0 },
      ],
      average_rating: 4.6,
      review_count: 67,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: 6,
      name: "Classic Sunglasses",
      slug: "classic-sunglasses",
      description: "UV protection with timeless style",
      price: 129.99,
      base_currency: "USD",
      stock: 89,
      category_id: 2,
      category: { id: 2, name: "Accessories", description: null, parent_id: null },
      tax_class_id: 1,
      is_active: true,
      sku: "SG-001",
      weight: null,
      length: null,
      width: null,
      height: null,
      featured: false,
      sales_count: 178,
      images: [{ id: 6, product_id: 6, url: "/classic-sunglasses-aviator.jpg", alt_text: "Sunglasses", sort_order: 0 }],
      average_rating: 4.4,
      review_count: 134,
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
    {
      id: 7,
      name: "Standing Desk",
      slug: "standing-desk",
      description: "Electric height-adjustable desk",
      price: 599.99,
      base_currency: "USD",
      stock: 12,
      category_id: 3,
      category: { id: 3, name: "Furniture", description: null, parent_id: null },
      tax_class_id: 1,
      is_active: true,
      sku: "SD-001",
      weight: null,
      length: null,
      width: null,
      height: null,
      featured: false,
      sales_count: 45,
      images: [{ id: 7, product_id: 7, url: "/electric-standing-desk-modern.jpg", alt_text: "Standing Desk", sort_order: 0 }],
      average_rating: 4.7,
      review_count: 38,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ]

  return categoryId === 0 ? allProducts : allProducts.filter((p) => p.category_id === categoryId)
}

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
]

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const category = getCategoryData(slug)
  const products = getCategoryProducts(category.id)

  const [search, setSearch] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("popular")
  const [filtersOpen, setFiltersOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 300)

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
      )
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0)
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        break
      case "popular":
      default:
        filtered.sort((a, b) => b.sales_count - a.sales_count)
    }

    return filtered
  }, [products, debouncedSearch, priceRange, inStockOnly, sortBy])

  const activeFiltersCount = [priceRange[0] > 0 || priceRange[1] < 1000, inStockOnly].filter(Boolean).length

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setInStockOnly(false)
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <Slider min={0} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock-cat"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(checked === true)}
        />
        <Label htmlFor="in-stock-cat" className="text-sm font-normal cursor-pointer">
          In Stock Only
        </Label>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-muted">
        <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
            <p className="text-lg text-white/80 max-w-lg mx-auto">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search in ${category.name}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <Badge variant="secondary" className="gap-1">
                ${priceRange[0]} - ${priceRange[1]}
                <button onClick={() => setPriceRange([0, 1000])}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {inStockOnly && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <button onClick={() => setInStockOnly(false)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FiltersContent />
            </div>
          </aside>

          <div className="flex-1">
            <p className="text-muted-foreground mb-4">Showing {filteredProducts.length} products</p>
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  )
}
