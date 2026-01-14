"use client";

import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import Badge from "@/components/admin/ui/badge/Badge";
import Image from "next/image";
import { adminProductService } from "@/services/admin/product-service";
import { Product } from "@/types/product";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await adminProductService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (slug: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await adminProductService.deleteProduct(slug);
                setProducts(products.filter((p) => p.slug !== slug));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Products
                </h3>
                <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                    <PlusIcon className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Product
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Category
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Price
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Stock
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" />
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" />
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                                                    {product.images && product.images[0] ? (
                                                        <Image
                                                            width={40}
                                                            height={40}
                                                            src={product.images[0].url}
                                                            alt={product.name}
                                                            className="object-cover h-10 w-10"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No img</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                        {product.name}
                                                    </p>
                                                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                        SKU: {product.sku}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {product.category?.name || "Uncategorized"}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            ${product.price}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {product.stock}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            <Badge
                                                size="sm"
                                                color={product.is_active ? "success" : "error"}
                                            >
                                                {product.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-gray-500 hover:text-brand-500">
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.slug)}
                                                    className="text-gray-500 hover:text-error-500"
                                                >
                                                    <TrashBinIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
