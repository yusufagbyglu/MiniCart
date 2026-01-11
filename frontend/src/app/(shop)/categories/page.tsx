import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Explore the latest gadgets and tech",
    image: "/electronics-category.png",
    product_count: 124,
  },
  {
    id: 2,
    name: "Accessories",
    slug: "accessories",
    description: "Complete your look with stylish accessories",
    image: "/accessories-category.png",
    product_count: 89,
  },
  {
    id: 3,
    name: "Furniture",
    slug: "furniture",
    description: "Transform your space with quality furniture",
    image: "/furniture-category.png",
    product_count: 56,
  },
  {
    id: 4,
    name: "Clothing",
    slug: "clothing",
    description: "Discover trendy fashion for every occasion",
    image: "/diverse-clothing-category.png",
    product_count: 203,
  },
  {
    id: 5,
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Everything you need for your home",
    image: "/modern-kitchen-appliances-home.jpg",
    product_count: 167,
  },
  {
    id: 6,
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Gear up for your next adventure",
    image: "/sports-equipment-outdoors.jpg",
    product_count: 78,
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shop by Category</h1>
        <p className="text-muted-foreground mt-1">Browse our curated collections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="group">
            <Card className="overflow-hidden h-full">
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-1">{category.name}</h2>
                  <p className="text-sm text-white/80 mb-2">{category.description}</p>
                  <p className="text-sm font-medium">{category.product_count} products</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
