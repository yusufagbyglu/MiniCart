import { Product } from './product';

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price_snapshot: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface Cart {
    id: number;
    user_id: number | null;
    guest_identifier: string | null;
    created_at: string;
    updated_at: string;
    items?: CartItem[];
}
