"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Input from "@/components/admin/form/input/InputField";
import Label from "@/components/admin/form/Label";
import Checkbox from "@/components/admin/form/input/Checkbox";
import { adminService } from "@/services/admin/admin-service";

interface TaxRateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    taxRate?: any | null;
}

export default function TaxRateModal({ isOpen, onClose, onSuccess, taxRate }: TaxRateModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        state: "",
        city: "",
        tax_type: "vat",
        rate: "",
        is_active: true,
    });

    useEffect(() => {
        if (taxRate) {
            setFormData({
                name: taxRate.name,
                country: taxRate.country,
                state: taxRate.state || "",
                city: taxRate.city || "",
                tax_type: taxRate.tax_type,
                rate: taxRate.rate.toString(),
                is_active: taxRate.is_active,
            });
        } else {
            setFormData({
                name: "",
                country: "",
                state: "",
                city: "",
                tax_type: "vat",
                rate: "",
                is_active: true,
            });
        }
    }, [taxRate, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                rate: parseFloat(formData.rate),
                state: formData.state || null,
                city: formData.city || null,
            };

            if (taxRate) {
                await adminService.updateTaxRate(taxRate.id, submitData);
            } else {
                await adminService.createTaxRate(submitData);
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error saving tax rate:", error);
            alert(error.message || "Failed to save tax rate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {taxRate ? "Edit Tax Rate" : "Add New Tax Rate"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., US Sales Tax"
                            required
                        />
                    </div>
                    <div>
                        <Label>Tax Type</Label>
                        <select
                            name="tax_type"
                            value={formData.tax_type}
                            onChange={handleInputChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            required
                        >
                            <option value="vat">VAT</option>
                            <option value="sales">Sales Tax</option>
                            <option value="gst">GST</option>
                            <option value="hst">HST</option>
                            <option value="pst">PST</option>
                            <option value="service">Service Tax</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Country</Label>
                        <Input
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="e.g., United States"
                            required
                        />
                    </div>
                    <div>
                        <Label>Rate (%)</Label>
                        <Input
                            name="rate"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={formData.rate}
                            onChange={handleInputChange}
                            placeholder="e.g., 7.50"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>State/Province (Optional)</Label>
                        <Input
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            placeholder="e.g., California"
                        />
                    </div>
                    <div>
                        <Label>City (Optional)</Label>
                        <Input
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g., Los Angeles"
                        />
                    </div>
                </div>

                <div className="flex items-center pt-2">
                    <Checkbox
                        label="Active"
                        checked={formData.is_active}
                        onChange={(checked) => handleCheckboxChange("is_active", checked)}
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
                        {taxRate ? "Update Tax Rate" : "Create Tax Rate"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
