"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Input from "@/components/admin/form/input/InputField";
import Label from "@/components/admin/form/Label";
import Checkbox from "@/components/admin/form/input/Checkbox";
import DatePicker from "@/components/admin/form/date-picker";
import { adminService } from "@/services/admin/admin-service";

interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    coupon?: any | null;
}

export default function CouponModal({ isOpen, onClose, onSuccess, coupon }: CouponModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        valid_from: "",
        valid_until: "",
        max_uses: "",
        is_active: true,
    });

    useEffect(() => {
        if (coupon) {
            setFormData({
                code: coupon.code,
                discount_type: coupon.discount_type,
                discount_value: coupon.discount_value.toString(),
                min_order_amount: coupon.min_order_amount?.toString() || "",
                valid_from: coupon.valid_from.split('T')[0], // Format for input date or flatpickr
                valid_until: coupon.valid_until.split('T')[0],
                max_uses: coupon.max_uses?.toString() || "",
                is_active: coupon.is_active,
            });
        } else {
            setFormData({
                code: "",
                discount_type: "percentage",
                discount_value: "",
                min_order_amount: "",
                valid_from: new Date().toISOString().split('T')[0],
                valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                max_uses: "",
                is_active: true,
            });
        }
    }, [coupon, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleDateChange = (name: string, dateStr: string) => {
        setFormData((prev) => ({ ...prev, [name]: dateStr }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                discount_value: parseFloat(formData.discount_value),
                min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            };

            if (coupon) {
                await adminService.updateCoupon(coupon.id, submitData);
            } else {
                await adminService.createCoupon(submitData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving coupon:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                {coupon ? "Edit Coupon" : "Add New Coupon"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Coupon Code</Label>
                        <Input
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="FALL2024"
                            required
                        />
                    </div>
                    <div>
                        <Label>Discount Type</Label>
                        <select
                            name="discount_type"
                            value={formData.discount_type}
                            onChange={handleInputChange}
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            required
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Discount Value</Label>
                        <Input
                            name="discount_value"
                            type="number"
                            step={0.01}
                            value={formData.discount_value}
                            onChange={handleInputChange}
                            placeholder="10.00"
                            required
                        />
                    </div>
                    <div>
                        <Label>Min Order Amount (Optional)</Label>
                        <Input
                            name="min_order_amount"
                            type="number"
                            step={0.01}
                            value={formData.min_order_amount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                        id="valid_from"
                        label="Valid From"
                        placeholder="Select date"
                        defaultDate={formData.valid_from}
                        onChange={(dates, dateStr) => handleDateChange("valid_from", dateStr)}
                    />
                    <DatePicker
                        id="valid_until"
                        label="Valid Until"
                        placeholder="Select date"
                        defaultDate={formData.valid_until}
                        onChange={(dates, dateStr) => handleDateChange("valid_until", dateStr)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Max Uses (Optional)</Label>
                        <Input
                            name="max_uses"
                            type="number"
                            value={formData.max_uses}
                            onChange={handleInputChange}
                            placeholder="Unlimited"
                        />
                    </div>
                    <div className="flex items-end pb-3">
                        <Checkbox
                            label="Active"
                            checked={formData.is_active}
                            onChange={(checked) => handleCheckboxChange("is_active", checked)}
                        />
                    </div>
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
                        {coupon ? "Update Coupon" : "Create Coupon"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
