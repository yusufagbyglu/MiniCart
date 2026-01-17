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
import TaxRateModal from "@/components/admin/tax-rates/TaxRateModal";

export default function TaxRatesPage() {
    const [taxRates, setTaxRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaxRate, setSelectedTaxRate] = useState<any | null>(null);

    const fetchTaxRates = async () => {
        setLoading(true);
        try {
            const data = await adminService.getTaxRates();
            setTaxRates(data);
        } catch (error) {
            console.error("Error fetching tax rates:", error);
            alert("Failed to load tax rates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxRates();
    }, []);

    const handleAdd = () => {
        setSelectedTaxRate(null);
        setIsModalOpen(true);
    };

    const handleEdit = (taxRate: any) => {
        setSelectedTaxRate(taxRate);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this tax rate?")) {
            return;
        }

        try {
            await adminService.deleteTaxRate(id);
            setTaxRates(taxRates.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Error deleting tax rate:", error);
            alert("Failed to delete tax rate");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Tax Rates
                </h3>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Tax Rate
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
                                    Type
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Rate (%)
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Country/State
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
                            ) : taxRates.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={6}>No tax rates found</TableCell>
                                </TableRow>
                            ) : (
                                taxRates.map((rate) => (
                                    <TableRow key={rate.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            {rate.name}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {rate.tax_type.toUpperCase()}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {rate.rate}%
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {rate.country}{rate.state ? `, ${rate.state}` : ''}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Badge
                                                size="sm"
                                                color={rate.is_active ? "success" : "error"}
                                            >
                                                {rate.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(rate)}
                                                    className="text-gray-500 hover:text-brand-500"
                                                    title="Edit tax rate"
                                                >
                                                    <PencilIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(rate.id)}
                                                    className="text-gray-500 hover:text-error-500"
                                                    title="Delete tax rate"
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

            <TaxRateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTaxRates}
                taxRate={selectedTaxRate}
            />
        </div>
    );
}
