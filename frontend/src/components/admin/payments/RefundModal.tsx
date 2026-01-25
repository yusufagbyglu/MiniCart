"use client";

import React, { useState } from 'react';
import { Modal } from '@/components/admin/ui/modal';
import Button from '@/components/admin/ui/button/Button';
import { adminPaymentService } from '@/services/admin/payment-service';
import { RefundReason } from '@/types/payment';

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: number;
    maxRefundAmount: number;
    currency: string;
    onSuccess: () => void;
}

const REFUND_REASONS: { value: RefundReason; label: string }[] = [
    { value: 'customer_request', label: 'Customer Request' },
    { value: 'product_defect', label: 'Product Defect' },
    { value: 'wrong_item', label: 'Wrong Item Shipped' },
    { value: 'not_received', label: 'Item Not Received' },
    { value: 'duplicate_charge', label: 'Duplicate Charge' },
    { value: 'other', label: 'Other' },
];

export default function RefundModal({
    isOpen,
    onClose,
    orderId,
    maxRefundAmount,
    currency,
    onSuccess
}: RefundModalProps) {
    const [amount, setAmount] = useState<string>(maxRefundAmount.toString());
    const [reason, setReason] = useState<RefundReason>('customer_request');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const refundAmount = parseFloat(amount);
            if (isNaN(refundAmount) || refundAmount <= 0) {
                throw new Error('Please enter a valid refund amount');
            }
            if (refundAmount > maxRefundAmount) {
                throw new Error(`Refund amount cannot exceed ${currency} ${maxRefundAmount}`);
            }

            await adminPaymentService.processRefund(orderId, {
                amount: refundAmount,
                reason,
                notes
            });

            onSuccess();
            onClose();
            // Reset form
            setNotes('');
            setReason('customer_request');
        } catch (err: any) {
            console.error('Refund failed:', err);
            setError(err.message || 'Failed to process refund');
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Process Refund</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm border border-blue-200">
                        <p>Maximum refundable amount: <strong>{currency} {maxRefundAmount.toFixed(2)}</strong></p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Refund Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">{currency === 'USD' ? '$' : currency}</span>
                            <input
                                type="number"
                                step="0.01"
                                max={maxRefundAmount}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value as RefundReason)}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {REFUND_REASONS.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Add internal notes about this refund..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            type="button"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Process Refund"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
