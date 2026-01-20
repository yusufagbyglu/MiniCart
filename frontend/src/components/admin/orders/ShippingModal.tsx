import React, { useState } from "react";
import { Modal } from "@/components/admin/ui/modal/index";
import Button from "@/components/admin/ui/button/Button";
import { adminShippingService } from "@/services/admin/shipping-service";
import toast from "react-hot-toast";

interface ShippingModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number | null;
    onSuccess: () => void;
    existingDetails?: any | null;
}

export default function ShippingModal({
    isOpen,
    onClose,
    orderId,
    onSuccess,
    existingDetails
}: ShippingModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        carrier: existingDetails?.carrier || "UPS",
        tracking_number: existingDetails?.tracking_number || "",
        shipping_cost: existingDetails?.shipping_cost || 0,
        shipped_at: existingDetails?.shipped_at ? new Date(existingDetails.shipped_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });

    const carriers = ["UPS", "FedEx", "USPS", "DHL", "Custom"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        try {
            await adminShippingService.updateShipping(orderId, formData);
            toast.success("Shipping details updated!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error updating shipping:", error);
            toast.error("Failed to update shipping details");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-md"
        >
            <div className="space-y-6">
                <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {existingDetails ? "Edit Shipping" : "Add Shipping Details"}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Carrier
                        </label>
                        <select
                            value={formData.carrier}
                            onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-700 dark:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                            {carriers.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tracking Number
                        </label>
                        <input
                            type="text"
                            value={formData.tracking_number}
                            onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                            required
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-700 dark:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="e.g. 1Z9999..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Shipping Date
                        </label>
                        <input
                            type="date"
                            value={formData.shipped_at}
                            onChange={(e) => setFormData({ ...formData, shipped_at: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-700 dark:text-gray-300 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Details"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
