"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Input from "@/components/admin/form/input/InputField";
import TextArea from "@/components/admin/form/input/TextArea";
import Label from "@/components/admin/form/Label";
import { adminCategoryService } from "@/services/admin/category-service";
import { Category } from "@/types/product";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, category }: CategoryModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        parent_id: "",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await adminCategoryService.getCategories();
                // Filter out the current category from being its own parent
                setCategories(data.filter(c => c.id !== category?.id));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, category]);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || "",
                parent_id: category.parent_id?.toString() || "",
            });
        } else {
            setFormData({
                name: "",
                description: "",
                parent_id: "",
            });
        }
    }, [category, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTextAreaChange = (value: string) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
            };

            if (category) {
                await adminCategoryService.updateCategory(category.id, submitData);
            } else {
                await adminCategoryService.createCategory(submitData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {category ? "Edit Category" : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Category Name</Label>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter category name"
                        required
                    />
                </div>

                <div>
                    <Label>Parent Category</Label>
                    <select
                        name="parent_id"
                        value={formData.parent_id}
                        onChange={handleInputChange}
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                    >
                        <option value="">Root (No Parent)</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <Label>Description</Label>
                    <TextArea
                        name="description"
                        value={formData.description}
                        onChange={handleTextAreaChange}
                        placeholder="Enter category description"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        )}
                        {category ? "Update Category" : "Create Category"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
