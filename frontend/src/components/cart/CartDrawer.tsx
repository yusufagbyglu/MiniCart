"use client";

import * as React from "react";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useCartStore } from "@/src/store/useCartStore";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] flex w-full flex-col bg-white shadow-2xl sm:max-w-md"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-5">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {items.length} items
                                </span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                        <ShoppingBag className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                                    <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
                                    <Button variant="premium" className="mt-8" onClick={onClose}>
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border bg-gray-50">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="line-clamp-1 font-semibold text-gray-900">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-rose-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 text-sm font-bold text-indigo-600">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center rounded-lg border bg-gray-50">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="flex h-8 w-8 items-center justify-center transition-colors hover:text-indigo-600"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="flex h-8 w-8 items-center justify-center transition-colors hover:text-indigo-600"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t p-6">
                                <div className="mb-6 flex items-center justify-between text-lg font-bold">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">${totalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link href="/checkout" onClick={onClose}>
                                        <Button variant="premium" className="w-full py-6 text-lg shadow-lg">
                                            Checkout Now
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full" onClick={onClose}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
