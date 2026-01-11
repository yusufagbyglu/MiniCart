import { Button } from "@/src/components/ui/button";
import { ProductCard } from "@/src/components/product/ProductCard";
import { ArrowRight, Zap, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        category: "Electronics",
        isNew: true,
    },
    {
        id: 2,
        name: "Minimalist Leather Watch",
        slug: "minimalist-leather-watch",
        price: 159.0,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
        category: "Accessories",
        discount: 15,
    },
    {
        id: 3,
        name: "Smart Home Speaker",
        slug: "smart-home-speaker",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=1000&auto=format&fit=crop",
        category: "Home",
    },
    {
        id: 4,
        name: "Sustainable Canvas Tote",
        slug: "sustainable-canvas-tote",
        price: 45.0,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop",
        category: "Acessories",
        isNew: true,
    },
];

export default function Home() {
    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-slate-900">
                <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="container relative mx-auto flex h-full items-center px-4 lg:px-8">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                            <Zap className="h-4 w-4 text-amber-400" />
                            New Collection Available Now
                        </div>
                        <h1 className="mb-6 font-outfit text-5xl font-bold leading-tight text-white md:text-7xl">
                            Shop Smarter, <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                                Live Better.
                            </span>
                        </h1>
                        <p className="mb-10 text-lg text-slate-300">
                            Discover our curated collection of premium products designed to elevate your everyday life. Quality guaranteed, delivered with speed.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" variant="premium">
                                Explore Collection
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                                Our Story
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 gap-6 rounded-3xl border bg-white/50 p-8 py-12 backdrop-blur-sm sm:grid-cols-3">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Fast Delivery</h3>
                            <p className="text-sm text-gray-500">Free shipping on orders over $100</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Secure Payments</h3>
                            <p className="text-sm text-gray-500">100% secure payment processing</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">24/7 Support</h3>
                            <p className="text-sm text-gray-500">Dedicated support team for you</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4 lg:px-8">
                <div className="mb-12 flex items-end justify-between">
                    <div>
                        <h2 className="font-outfit text-3xl font-bold text-gray-900 md:text-4xl">Featured Products</h2>
                        <p className="mt-2 text-gray-500">Our hand-picked selection of the week.</p>
                    </div>
                    <Link href="/shop" className="group flex items-center font-semibold text-indigo-600">
                        View All
                        <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {MOCK_PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 lg:px-8">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 px-8 py-20 text-center text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 mx-auto max-w-2xl">
                        <h2 className="mb-6 font-outfit text-4xl font-bold md:text-5xl">Join the MiniCart Revolution</h2>
                        <p className="mb-10 text-lg text-indigo-100">
                            Get 15% off your first purchase and stay updated with our latest releases and exclusive offers.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="h-14 w-full rounded-full border-none bg-white px-8 text-gray-900 outline-none focus:ring-4 focus:ring-indigo-300 sm:w-80"
                            />
                            <Button size="lg" className="h-14 bg-gray-900 px-10 hover:bg-gray-800">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
