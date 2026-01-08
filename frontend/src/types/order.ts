import { Product } from './product';

export interface Order {
    id: number;
    user_id: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    shipping_amount: number;
    total: number;
    notes: string | null;
    coupon_id: number | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_snapshot: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}
