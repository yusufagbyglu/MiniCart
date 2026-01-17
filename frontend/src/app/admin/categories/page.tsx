"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { adminCategoryService } from "@/services/admin/category-service";
import { Category } from "@/types/product";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import SearchBar from "@/components/admin/ui/SearchBar";
import Pagination from "@/components/admin/ui/Pagination";
import toast from "react-hot-toast";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]); // For parent name lookup
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAllCategories = async () => {
        try {
            const data = await adminCategoryService.getCategories();
            setAllCategories(data);
        } catch (error) {
            console.error("Error fetching all categories:", error);
        }
    };

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                per_page: itemsPerPage,
            };

            if (searchQuery) params.search = searchQuery;

            const response = await adminCategoryService.getPaginatedCategories(params);
            setCategories(response.data);
            setTotalItems(response.meta.total);
            setTotalPages(response.meta.last_page);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery]);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (size: number) => {
        setItemsPerPage(size);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            await adminCategoryService.deleteCategory(id);
            toast.success("Category deleted successfully");
            fetchCategories();
            fetchAllCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    const getParentName = (parentId: number | null) => {
        if (!parentId) return "Root";
        const parent = allCategories.find(c => c.id === parentId);
        return parent ? parent.name : "Unknown";
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Categories
                </h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            <div className="max-w-md">
                <SearchBar
                    placeholder="Search by name..."
                    onSearch={handleSearch}
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Name
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Description
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Parent Category
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={4}>
                                        <div className="flex justify-center py-4">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={4}>No categories found</TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {category.name}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {category.description || "-"}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {getParentName(category.parent_id)}
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="text-gray-500 hover:text-brand-500"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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

                {!loading && categories.length > 0 && (
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

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchCategories();
                    fetchAllCategories();
                }}
                category={selectedCategory}
            />
        </div>
    );
}

