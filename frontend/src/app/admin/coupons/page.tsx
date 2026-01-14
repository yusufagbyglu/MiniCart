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
import { adminService } from "@/services/admin/admin-service";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const data = await adminService.getCoupons();
                setCoupons(data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await adminService.deleteCoupon(id);
                setCoupons(coupons.filter((c) => c.id !== id));
            } catch (error) {
                console.error("Error deleting coupon:", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Coupons
                </h3>
                <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600">
                    <PlusIcon className="w-4 h-4" />
                    Add Coupon
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Code
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Discount
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Valid From
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Valid Until
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
                                    <TableCell className="py-4 text-center" colSpan={6}>Loading...</TableCell>
                                </TableRow>
                            ) : coupons.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={6}>No coupons found</TableCell>
                                </TableRow>
                            ) : (
                                coupons.map((coupon) => (
                                    <TableRow key={coupon.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {new Date(coupon.valid_from).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {new Date(coupon.valid_until).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Badge
                                                size="sm"
                                                color={coupon.is_active ? "success" : "error"}
                                            >
                                                {coupon.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="text-gray-500 hover:text-brand-500">
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
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
