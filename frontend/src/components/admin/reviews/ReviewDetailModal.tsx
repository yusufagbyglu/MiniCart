import React, { useState } from "react";
import { Modal } from "@/components/admin/ui/modal";
import { Review } from "@/types/review";
import { adminReviewService } from "@/services/admin/review-service";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import Rating from "@/components/admin/ui/Rating";
import Image from "next/image";
import toast from "react-hot-toast";

interface ReviewDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    review: Review | null;
    onSuccess: () => void;
}


export default function ReviewDetailModal({
    isOpen,
    onClose,
    review,
    onSuccess,
}: ReviewDetailModalProps) {
    const [loading, setLoading] = useState(false);

    if (!review) return null;

    const handleToggleApproval = async () => {
        setLoading(true);
        try {
            await adminReviewService.toggleApproval(review.id);
            toast.success(review.is_approved ? "Review unapproved" : "Review approved");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error toggling approval:", error);
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        setLoading(true);
        try {
            await adminReviewService.deleteReview(review.id);
            toast.success("Review deleted");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Failed to delete review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-2xl"
        >
            <div className="space-y-6">
                <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Review Details</h3>
                </div>
                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
                            {review.title || "No Title"}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                            <Rating value={review.rating} size="md" />
                            <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <Badge
                        color={review.is_approved ? "success" : "warning"}
                    >
                        {review.is_approved ? "Approved" : "Pending"}
                    </Badge>
                </div>

                {/* Content */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {review.comment || "No comment provided."}
                    </p>
                </div>

                {/* Product & User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                            Product
                        </h5>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden relative">
                                {review.product?.images?.[0] ? (
                                    <Image
                                        src={review.product.images[0].url}
                                        alt={review.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                        No Img
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white/90 line-clamp-1">
                                    {review.product?.name || "Unknown Product"}
                                </p>
                                <p className="text-xs text-brand-500">
                                    {review.product?.slug}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">
                            Customer
                        </h5>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
                                {review.user?.name?.[0]?.toUpperCase() || "u"}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white/90">
                                    {review.user?.name || "Guest"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {review.user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete Review
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleToggleApproval}
                        disabled={loading}
                    >
                        {review.is_approved ? "Unapprove" : "Approve Review"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
