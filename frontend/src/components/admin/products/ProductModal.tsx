"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Input from "@/components/admin/form/input/InputField";
import TextArea from "@/components/admin/form/input/TextArea";
import Label from "@/components/admin/form/Label";
import Checkbox from "@/components/admin/form/input/Checkbox";
import FileInput from "@/components/admin/form/input/FileInput";
import { adminCategoryService } from "@/services/admin/category-service";
import { Category, Product } from "@/types/product";
import { adminProductService } from "@/services/admin/product-service";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        category_id: "",
        is_active: true,
        featured: false,
    });
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await adminCategoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                sku: product.sku,
                category_id: product.category_id.toString(),
                is_active: product.is_active,
                featured: product.featured,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                sku: "",
                category_id: "",
                is_active: true,
                featured: false,
            });
        }
        setImages([]);
    }, [product, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTextAreaChange = (value: string) => {
        setFormData((prev) => ({ ...prev, description: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value.toString());
            });

            submitData.append("base_currency", "USD");

            images.forEach((image) => {
                submitData.append("images[]", image);
            });

            if (product) {
                submitData.append("_method", "PUT");
                await adminProductService.updateProduct(product.slug, submitData);
            } else {
                await adminProductService.createProduct(submitData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {product ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Product Name</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <Label>SKU</Label>
                        <Input
                            name="sku"
                            value={formData.sku}
                            onChange={handleInputChange}
                            placeholder="Enter SKU"
                        />
                    </div>
                </div>

                <div>
                    <Label>Description</Label>
                    <TextArea
                        value={formData.description}
                        onChange={handleTextAreaChange}
                        placeholder="Enter product description"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label>Price</Label>
                        <Input
                            name="price"
                            type="number"
                            step={0.01}
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <Label>Stock</Label>
                        <Input
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <Label>Category</Label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    <Checkbox
                        label="Active"
                        checked={formData.is_active}
                        onChange={(checked) => handleCheckboxChange("is_active", checked)}
                    />
                    <Checkbox
                        label="Featured"
                        checked={formData.featured}
                        onChange={(checked) => handleCheckboxChange("featured", checked)}
                    />
                </div>

                <div>
                    <Label>Product Images</Label>
                    <FileInput onChange={handleFileChange} />
                    {product && product.images && product.images.length > 0 && (
                        <div className="mt-2 flex gap-2 overflow-x-auto p-2">
                            {product.images.map((img) => (
                                <div key={img.id} className="relative h-16 w-16 flex-shrink-0">
                                    <img src={img.url} alt="product" className="h-full w-full object-cover rounded shadow border dark:border-gray-700" />
                                </div>
                            ))}
                        </div>
                    )}
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
                        {product ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
