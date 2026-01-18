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
import { adminService } from "@/services/admin/admin-service";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";
import TaxRateModal from "@/components/admin/tax-rates/TaxRateModal";
import SearchBar from "@/components/admin/ui/SearchBar";
import FilterDropdown from "@/components/admin/ui/FilterDropdown";
import Pagination from "@/components/admin/ui/Pagination";
import toast from "react-hot-toast";

export default function TaxRatesPage() {
    const [taxRates, setTaxRates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTaxRate, setSelectedTaxRate] = useState<any | null>(null);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string | number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | number | null>(null);
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTaxRates = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                per_page: itemsPerPage,
                sort: sortBy,
                order: sortOrder,
            };

            if (searchQuery) params.search = searchQuery;
            if (typeFilter) params.type = typeFilter;
            if (statusFilter !== null) params.is_active = statusFilter === "active";

            const response = await adminService.getTaxRates(params);
            setTaxRates(response.data);
            setTotalItems(response.meta.total);
            setTotalPages(response.meta.last_page);
        } catch (error) {
            console.error("Error fetching tax rates:", error);
            toast.error("Failed to load tax rates");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, typeFilter, statusFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchTaxRates();
    }, [fetchTaxRates]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
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
            toast.success("Tax rate deleted successfully");
            fetchTaxRates();
        } catch (error) {
            console.error("Error deleting tax rate:", error);
            toast.error("Failed to delete tax rate");
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="md:col-span-2 lg:col-span-1">
                    <SearchBar
                        placeholder="Search by name, country..."
                        onSearch={handleSearch}
                    />
                </div>
                <FilterDropdown
                    label="Type"
                    value={typeFilter}
                    onChange={handleFilterChange(setTypeFilter)}
                    options={[
                        { label: "Percentage", value: "percentage" },
                        { label: "Fixed", value: "fixed" },
                    ]}
                />
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
                    label="Sort By"
                    value={`${sortBy}:${sortOrder}`}
                    onChange={handleSortChange}
                    options={[
                        { label: "Newest First", value: "created_at:desc" },
                        { label: "Oldest First", value: "created_at:asc" },
                        { label: "Name (A-Z)", value: "name:asc" },
                        { label: "Name (Z-A)", value: "name:desc" },
                        { label: "Rate (High-Low)", value: "rate:desc" },
                        { label: "Rate (Low-High)", value: "rate:asc" },
                    ]}
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
                                    <TableCell className="py-4 text-center" colSpan={6}>
                                        <div className="flex justify-center py-4">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    </TableCell>
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
                                            {rate.tax_type?.toUpperCase()}
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

                {!loading && taxRates.length > 0 && (
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

            <TaxRateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTaxRates}
                taxRate={selectedTaxRate}
            />
        </div>
    );
}
