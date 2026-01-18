"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { adminCategoryService } from "@/services/admin/category-service";
import { Product, Category } from "@/types/product";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";
import ProductModal from "@/components/admin/products/ProductModal";
import SearchBar from "@/components/admin/ui/SearchBar";
import FilterDropdown from "@/components/admin/ui/FilterDropdown";
import Pagination from "@/components/admin/ui/Pagination";
import toast from "react-hot-toast";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | number | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string | number | null>(null);
    const [stockFilter, setStockFilter] = useState<string | number | null>(null);
    const [featuredFilter, setFeaturedFilter] = useState<string | number | null>(null);
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<string>("desc");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Filter data
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        try {
            const data = await adminCategoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                per_page: itemsPerPage,
                sort: sortBy,
                order: sortOrder,
            };

            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== null) params.is_active = statusFilter === "active";
            if (categoryFilter !== null) params.category_id = categoryFilter;
            if (stockFilter !== null) params.stock_level = stockFilter;
            if (featuredFilter !== null) params.featured = featuredFilter === "featured";

            const response = await adminProductService.getProducts(params);
            setProducts(response.data);
            setTotalItems(response.meta.total);
            setTotalPages(response.meta.last_page);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, statusFilter, categoryFilter, stockFilter, featuredFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleFilterChange = (setter: any) => (value: any) => {
        setter(value);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string | number | null) => {
        if (!value) return;
        const [field, order] = (value as string).split(":");
        setSortBy(field);
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (size: number) => {
        setItemsPerPage(size);
        setCurrentPage(1);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (slug: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await adminProductService.deleteProduct(slug);
                fetchProducts();
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
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="md:col-span-2 lg:col-span-2">
                    <SearchBar
                        placeholder="Search by name, SKU..."
                        onSearch={handleSearch}
                    />
                </div>
                <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={handleFilterChange(setStatusFilter)}
                    options={[
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                    ]}
                />
                <FilterDropdown
                    label="Category"
                    value={categoryFilter}
                    onChange={handleFilterChange(setCategoryFilter)}
                    options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                    }))}
                />
                <FilterDropdown
                    label="Stock Level"
                    value={stockFilter}
                    onChange={handleFilterChange(setStockFilter)}
                    options={[
                        { label: "In Stock", value: "in_stock" },
                        { label: "Low Stock", value: "low_stock" },
                        { label: "Out of Stock", value: "out_of_stock" },
                    ]}
                />
                <FilterDropdown
                    label="Sort By"
                    value={`${sortBy}:${sortOrder}`}
                    onChange={handleSortChange}
                    options={[
                        { label: "Newest First", value: "created_at:desc" },
                        { label: "Oldest First", value: "created_at:asc" },
                        { label: "Name (A-Z)", value: "name:asc" },
                        { label: "Name (Z-A)", value: "name:desc" },
                        { label: "Price (Low-High)", value: "price:asc" },
                        { label: "Price (High-Low)", value: "price:desc" },
                        { label: "Stock (Low-High)", value: "stock:asc" },
                        { label: "Stock (High-Low)", value: "stock:desc" },
                    ]}
                />
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
                                    <TableCell className="py-4 text-center" colSpan={6}>
                                        <div className="flex justify-center py-4">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={6}>No products found</TableCell>
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
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-gray-500 hover:text-brand-500"
                                                >
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

                {!loading && products.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchProducts}
                product={selectedProduct}
            />
        </div>
    );
}
