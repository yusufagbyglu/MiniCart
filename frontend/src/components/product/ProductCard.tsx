"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/src/lib/utils";

interface ProductCardProps {
    product: {
        id: string | number;
        name: string;
        slug: string;
        price: number;
        image: string;
        category?: string;
        isNew?: boolean;
        discount?: number;
    };
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-white/50 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/10",
                className
            )}
        >
            {/* Badge Container */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
                {product.isNew && <Badge variant="success">New</Badge>}
                {product.discount && (
                    <Badge variant="destructive">-{product.discount}%</Badge>
                )}
            </div>

            {/* Wishlist Button */}
            <button className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground backdrop-blur-sm transition-all hover:bg-white hover:text-rose-500 shadow-sm">
                <Heart className="h-4 w-4" />
            </button>

            {/* Image Section */}
            <Link href={`/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <Button size="icon" variant="secondary" className="rounded-full">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="premium" className="rounded-full shadow-lg">
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </div>
            </Link>

            {/* Content Section */}
            <div className="flex flex-1 flex-col p-4 pt-5">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600/80">
                    {product.category || "General"}
                </div>
                <Link href={`/${product.slug}`} className="group/title">
                    <h3 className="line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover/title:text-indigo-600">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-indigo-800 bg-clip-text text-transparent">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.discount && (
                            <span className="text-sm text-gray-400 line-through">
                                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-amber-500">
                        Ã¢Ëœâ€¦ <span className="text-gray-600">4.8</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
