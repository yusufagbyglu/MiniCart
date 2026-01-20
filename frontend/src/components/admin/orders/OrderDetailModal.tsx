"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import { adminOrderService } from "@/services/admin/order-service";
import { adminShippingService } from "@/services/admin/shipping-service";
import ShippingModal from "./ShippingModal";
import TrackingInfoCard from "./TrackingInfoCard";

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    onStatusUpdate?: () => void;
}

export default function OrderDetailModal({ isOpen, onClose, orderId, onStatusUpdate }: OrderDetailModalProps) {
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetails();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetails = async () => {
        if (!orderId) return;

        setLoading(true);
        try {
            const data = await adminOrderService.getOrder(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Error fetching order details:", error);
            alert("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;

        setUpdatingStatus(true);
        try {
            if (newStatus === 'delivered') {
                // If marking as delivered, we can use the specific endpoint which updates status + timestamp
                await adminShippingService.markAsDelivered(order.id);
            } else {
                await adminOrderService.updateOrderStatus(order.id, newStatus);
            }

            // Refresh order to get updated status and timestamps
            await fetchOrderDetails();

            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        } finally {
            setUpdatingStatus(false);
        }
    };



    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "success";
            case "shipped": return "info";
            case "processing": return "warning";
            case "pending": return "warning";
            case "cancelled": return "error";
            case "refunded": return "error";
            default: return "info";
        }
    };

    if (loading) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px] p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                </div>
            </Modal>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] p-8 max-h-[90vh] overflow-y-auto">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Order #{order.order_number}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                                {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Badge size="md" color={getStatusColor(order.status)}>
                                {order.status.toUpperCase()}
                            </Badge>
                            {order.payment_status === 'paid' && (
                                <Badge size="sm" color="success">PAID</Badge>
                            )}
                            {order.payment_status === 'pending' && (
                                <Badge size="sm" color="warning">UNPAID</Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Update */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Update Order Status
                            </label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={updatingStatus}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        {/* Shipping Actions */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col justify-center items-start">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Shipping Management
                            </label>
                            {!order.shipping_details ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsShippingModalOpen(true)}
                                    startIcon={<span className="text-lg">+</span>}
                                >
                                    Add Shipping Details
                                </Button>
                            ) : (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>Tracking provided. See below.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Details Card */}
                    {order.shipping_details && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                Shipping & Tracking
                            </h3>
                            <TrackingInfoCard
                                shippingDetail={order.shipping_details}
                                onEdit={() => setIsShippingModalOpen(true)}
                            />
                        </div>
                    )}

                    {/* Customer Information */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {order.user?.name || "Guest"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {order.user?.email || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                Shipping Address
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                <p className="font-medium">{order.shipping_address.full_name}</p>
                                <p>{order.shipping_address.address_line1}</p>
                                {order.shipping_address.address_line2 && (
                                    <p>{order.shipping_address.address_line2}</p>
                                )}
                                <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{" "}
                                    {order.shipping_address.postal_code}
                                </p>
                                <p>{order.shipping_address.country}</p>
                                {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.items?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {item.product?.name || "Product"}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Quantity: {item.quantity} × ${item.unit_price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800 dark:text-white">
                                            ${item.total_price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                            Order Summary
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="text-gray-800 dark:text-white">
                                    ${(order.total_amount - (order.tax_amount || 0) + (order.discount_amount || 0)).toFixed(2)}
                                </span>
                            </div>
                            {(order.tax_amount > 0) && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                                    <span className="text-gray-800 dark:text-white">${order.tax_amount}</span>
                                </div>
                            )}
                            {(order.shipping_details?.shipping_cost > 0) && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                                    <span className="text-gray-800 dark:text-white">${order.shipping_details.shipping_cost}</span>
                                </div>
                            )}
                            {(order.discount_amount > 0) && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount:</span>
                                    <span>-${order.discount_amount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span className="text-gray-800 dark:text-white">Total:</span>
                                <span className="text-gray-800 dark:text-white">
                                    ${(Number(order.total_amount) + Number(order.shipping_details?.shipping_cost || 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                Notes
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{order.notes}</p>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="primary"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            {order && (
                <ShippingModal
                    isOpen={isShippingModalOpen}
                    onClose={() => setIsShippingModalOpen(false)}
                    orderId={order.id}
                    onSuccess={() => {
                        fetchOrderDetails();
                        setIsShippingModalOpen(false);
                    }}
                    existingDetails={order.shipping_details}
                />
            )}
        </>
    );
}
