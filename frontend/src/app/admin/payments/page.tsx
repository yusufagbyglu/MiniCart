"use client";

import React, { useState, useEffect } from "react";
import { adminPaymentService } from "@/services/admin/payment-service";
import { Payment, PaymentStats } from "@/types/payment";
import SearchBar from "@/components/admin/ui/SearchBar";
import FilterDropdown from "@/components/admin/ui/FilterDropdown";
import Pagination from "@/components/admin/ui/Pagination";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import DateRangePicker from "@/components/admin/ui/DateRangePicker";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<PaymentStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        method: "",
        start_date: "",
        end_date: ""
    });

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [pagination.current_page, pagination.per_page, filters]);

    const fetchStats = async () => {
        try {
            const data = await adminPaymentService.getStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching payment stats:", error);
        }
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await adminPaymentService.getPayments({
                page: pagination.current_page,
                per_page: pagination.per_page,
                ...filters
            });
            setPayments(response.data);
            setPagination({
                current_page: response.meta.current_page,
                last_page: response.meta.last_page,
                total: response.meta.total,
                per_page: response.meta.per_page
            });
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const handleDateRangeChange = (range: { from: string; to: string }) => {
        setFilters(prev => ({
            ...prev,
            start_date: range.from,
            end_date: range.to
        }));
        setPagination(prev => ({ ...prev, current_page: 1 }));
    };

    const getStatusColor = (status: string): "success" | "warning" | "error" | "info" | "light" => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'refunded': return 'info';
            case 'cancelled': return 'light';
            default: return 'light';
        }
    };

    const formatCurrency = (amount: number, currency: string | null) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payments & Transactions</h1>
                <Button variant="outline" onClick={fetchStats}>Refresh Stats</Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(stats.total_revenue, 'USD')}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Refunded</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(stats.total_refunded, 'USD')}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Successful Payments</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.total_payments - stats.failed_payments}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Failed / Pending</p>
                        <div className="flex gap-2 text-2xl font-bold">
                            <span className="text-red-600">{stats.failed_payments}</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-yellow-600">{stats.pending_payments}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Search transaction ID or order number..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <FilterDropdown
                            label="Status"
                            options={[
                                { value: '', label: 'All Statuses' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'failed', label: 'Failed' },
                                { value: 'refunded', label: 'Refunded' },
                            ]}
                            value={filters.status}
                            onChange={(val) => handleFilterChange('status', val)}
                        />
                        <FilterDropdown
                            label="Method"
                            options={[
                                { value: '', label: 'All Methods' },
                                { value: 'stripe', label: 'Stripe' },
                                { value: 'paypal', label: 'PayPal' },
                                { value: 'credit_card', label: 'Credit Card' },
                                { value: 'bank_transfer', label: 'Bank Transfer' },
                            ]}
                            value={filters.method}
                            onChange={(val) => handleFilterChange('method', val)}
                        />
                    </div>
                </div>
                <div>
                    <DateRangePicker
                        label="Filter by Date"
                        value={{ from: filters.start_date, to: filters.end_date }}
                        onChange={handleDateRangeChange}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Order</th>
                                <th className="px-6 py-4 font-medium">Transaction ID</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Method</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Refunded</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Loading payments...
                                    </td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No payments found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">
                                                {new Date(payment.created_at).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            #{payment.order?.order_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                            {payment.transaction_id || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(payment.amount, payment.currency)}
                                        </td>
                                        <td className="px-6 py-4 capitalize text-gray-600 dark:text-gray-300">
                                            {payment.method.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge color={getStatusColor(payment.status)}>
                                                {payment.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {payment.total_refunded > 0 ? (
                                                <span className="text-red-500 flex flex-col">
                                                    <span>-{formatCurrency(payment.total_refunded, payment.currency)}</span>
                                                    {payment.status === 'refunded' && (
                                                        <span className="text-xs">(Full)</span>
                                                    )}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        totalItems={pagination.total}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, current_page: page }))}
                        itemsPerPage={pagination.per_page}
                        onItemsPerPageChange={(itemsPerPage: number) => setPagination(prev => ({ ...prev, per_page: itemsPerPage, current_page: 1 }))}
                    />
                </div>
            </div>
        </div>
    );
}
