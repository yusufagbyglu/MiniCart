"use client";

import React, { useState, useEffect } from "react";
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

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await adminCategoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await adminCategoryService.deleteCategory(id);
                setCategories(categories.filter((c) => c.id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Categories
                </h3>
                <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                    <PlusIcon className="w-4 h-4" />
                    Add Category
                </button>
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
                                    <TableCell className="py-4 text-center" />
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
                                            {category.parent_id || "Root"}
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-gray-500 hover:text-brand-500">
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
            </div>
        </div>
    );
}
