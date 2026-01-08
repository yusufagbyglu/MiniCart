"use client";

import * as React from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "../cart/CartDrawer";
import { useCartStore } from "@/src/store/useCartStore";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isCartOpen, setIsCartOpen] = React.useState(false);

    const { totalItems } = useCartStore();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                isScrolled
                    ? "border-b bg-white/80 py-3 backdrop-blur-md"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="group flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-indigo-200 transition-transform group-hover:scale-110">
                                <ShoppingBag className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">
                                Mini<span className="text-indigo-600">Cart</span>
                            </span>
                        </Link>

                        <div className="hidden items-center gap-1 md:flex">
                            {["Shop", "Categories", "Deals", "About"].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden items-center gap-2 lg:flex">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="h-10 w-48 rounded-full border bg-gray-50 pl-10 pr-4 text-sm outline-none transition-all focus:w-64 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>


                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-full"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                {totalItems()}
                            </span>
                        </Button>

                        <Link href="/login" className="hidden sm:block">
                            <Button variant="premium" className="rounded-full px-6">
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t bg-white md:hidden"
                    >
                        <div className="flex flex-col gap-2 p-4">
                            {["Shop", "Categories", "Deals", "About"].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="rounded-lg p-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <hr className="my-2" />
                            <Button variant="premium" className="w-full justify-center">
                                Sign In
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
}
