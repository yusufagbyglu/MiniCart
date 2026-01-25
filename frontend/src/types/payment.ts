import { Order } from "./order";
import { User } from "./auth";

export type PaymentMethod = 'fake' | 'stripe' | 'paypal' | 'credit_card' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
    id: number;
    order_id: number;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transaction_id: string | null;
    currency: string;
    created_at: string;
    updated_at: string;
    total_refunded: number;
    is_refundable: boolean;
    order?: Order;
    refunds?: Refund[];
}

export type RefundReason = 'customer_request' | 'product_defect' | 'wrong_item' | 'not_received' | 'duplicate_charge' | 'other';
export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Refund {
    id: number;
    payment_id: number;
    order_id: number;
    amount: number;
    reason: RefundReason;
    notes: string | null;
    status: RefundStatus;
    refund_transaction_id: string | null;
    processed_by: number;
    processed_at: string;
    created_at: string;
    updated_at: string;
    processed_by_user?: User;
    order?: Order;
}

export interface PaymentStats {
    total_payments: number;
    total_revenue: number;
    total_refunded: number;
    pending_payments: number;
    failed_payments: number;
    refund_stats: {
        total_refunds: number;
        total_refund_amount: number;
        pending_refunds: number;
    };
}
