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
import { adminReviewService } from "@/services/admin/review-service";
import Rating from "@/components/admin/ui/Rating";
import SearchBar from "@/components/admin/ui/SearchBar";
import FilterDropdown from "@/components/admin/ui/FilterDropdown";
import Pagination from "@/components/admin/ui/Pagination";
import ReviewDetailModal from "@/components/admin/reviews/ReviewDetailModal";
import { EyeIcon } from "@/icons";
import toast from "react-hot-toast";
import { Review } from "@/types/review";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | number | null>(null);
    const [ratingFilter, setRatingFilter] = useState<string | number | null>(null);
    const [sortBy, setSortBy] = useState("created_at:desc");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [field, order] = sortBy.split(":");
            const queryParams: any = {
                page: currentPage,
                per_page: itemsPerPage,
                sort: field,
                order: order,
            };

            if (searchQuery) queryParams.search = searchQuery;
            if (statusFilter) queryParams.status = statusFilter;
            if (ratingFilter) queryParams.rating = ratingFilter;

            const response = await adminReviewService.getReviews(queryParams);
            setReviews(response.data);
            setTotalItems(response.meta.total);
            setTotalPages(response.meta.last_page);

            // Stats
            const statsData = await adminReviewService.getReviewStats();
            setStats(statsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, statusFilter, ratingFilter, sortBy]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSortChange = (value: string | number | null) => {
        if (value) setSortBy(String(value));
    };

    const handleView = (review: Review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                    Reviews
                </h3>
                {stats && (
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hidden md:block">
                            <span className="text-sm text-gray-500">Total</span>
                            <p className="font-semibold text-lg text-gray-800 dark:text-white">{stats.total_reviews}</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hidden md:block">
                            <span className="text-sm text-gray-500">Pending</span>
                            <p className="font-semibold text-lg text-warning-500">{stats.pending_count}</p>
                        </div>
                        <div className="bg-white dark:bg-white/5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hidden md:block">
                            <span className="text-sm text-gray-500">Avg Rating</span>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-lg text-gray-800 dark:text-white">{Number(stats.average_rating).toFixed(1)}</p>
                                <Rating value={Math.round(stats.average_rating)} size="sm" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="md:col-span-2 lg:col-span-2">
                    <SearchBar
                        placeholder="Search reviews, products, users..."
                        onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                    />
                </div>
                <FilterDropdown
                    label="Status"
                    value={statusFilter}
                    onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
                    options={[
                        { label: "Approved", value: "approved" },
                        { label: "Pending", value: "pending" },
                    ]}
                />
                <FilterDropdown
                    label="Rating"
                    value={ratingFilter}
                    onChange={(v) => { setRatingFilter(v); setCurrentPage(1); }}
                    options={[
                        { label: "5 Stars", value: 5 },
                        { label: "4 Stars", value: 4 },
                        { label: "3 Stars", value: 3 },
                        { label: "2 Stars", value: 2 },
                        { label: "1 Star", value: 1 },
                    ]}
                />
                <FilterDropdown
                    label="Sort By"
                    value={sortBy}
                    onChange={handleSortChange}
                    options={[
                        { label: "Newest First", value: "created_at:desc" },
                        { label: "Oldest First", value: "created_at:asc" },
                        { label: "Highest Rating", value: "rating:desc" },
                        { label: "Lowest Rating", value: "rating:asc" },
                    ]}
                />
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start">Product</TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start">Reviewer</TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start">Rating</TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start">Review</TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start">Status</TableCell>
                                <TableCell isHeader className="py-3 font-medium text-gray-500 text-end">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">
                                        <div className="flex justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4">No reviews found</TableCell>
                                </TableRow>
                            ) : (
                                reviews.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                                            {review.product?.name || "Unknown"}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500">
                                            {review.user?.name || "Guest"}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Rating value={review.rating} size="sm" />
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-500 truncate max-w-xs text-sm">
                                            {review.title ? <span className="font-medium block text-gray-800 dark:text-white/90">{review.title}</span> : null}
                                            <span className="block truncate">{review.comment}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <Badge color={review.is_approved ? "success" : "warning"}>
                                                {review.is_approved ? "Approved" : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-end">
                                            <button
                                                onClick={() => handleView(review)}
                                                className="text-gray-500 hover:text-brand-500 transition-colors"
                                                title="View Details"
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
                {!loading && reviews.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={(size) => { setItemsPerPage(size); setCurrentPage(1); }}
                    />
                )}
            </div>

            <ReviewDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                review={selectedReview}
                onSuccess={fetchData}
            />
        </div>
    );
}
