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
import { adminOrderService } from "@/services/admin/order-service";
import { EyeIcon } from "@/icons";
import OrderDetailModal from "@/components/admin/orders/OrderDetailModal";
import SearchBar from "@/components/admin/ui/SearchBar";
import FilterDropdown from "@/components/admin/ui/FilterDropdown";
import Pagination from "@/components/admin/ui/Pagination";
import toast from "react-hot-toast";
import Input from "@/components/admin/form/input/InputField";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search and Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | number | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                per_page: itemsPerPage,
            };

            if (searchQuery) params.search = searchQuery;
            if (statusFilter) params.status = statusFilter;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await adminOrderService.getOrders(params);
            setOrders(response.data);
            setTotalItems(response.meta.total);
            setTotalPages(response.meta.last_page);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, statusFilter, startDate, endDate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleStatusFilter = (value: string | number | null) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (size: number) => {
        setItemsPerPage(size);
        setCurrentPage(1);
    };

    const handleViewOrder = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const orderStatuses = [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Orders
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                    <SearchBar
                        placeholder="Search orders..."
                        onSearch={handleSearch}
                    />
                </div>
                <div>
                    <FilterDropdown
                        label="Status"
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        options={orderStatuses}
                    />
                </div>
                <div>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Start Date"
                    />
                </div>
                <div>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="End Date"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Order Number
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Customer
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Date
                                </TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Total
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
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell className="py-4 text-center" colSpan={6}>No orders found</TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                            #{order.order_number}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {order.user?.name || "Guest"}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                            ${order.total_amount}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Badge
                                                size="sm"
                                                color={
                                                    order.status === "delivered"
                                                        ? "success"
                                                        : order.status === "pending"
                                                            ? "warning"
                                                            : order.status === "cancelled"
                                                                ? "error"
                                                                : "info"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <button
                                                onClick={() => handleViewOrder(order.id)}
                                                className="text-gray-500 hover:text-brand-500"
                                                title="View order details"
                                            >
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {!loading && orders.length > 0 && (
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

            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orderId={selectedOrderId}
                onStatusUpdate={fetchOrders}
            />
        </div>
    );
}
