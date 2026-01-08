// Product Types
export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    category_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductFormData {
    name: string;
    slug?: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    category_id: number;
    is_active?: boolean;
}

// Category Types
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Cart Types
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

// Coupon Types
export interface Coupon {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_purchase_amount: number | null;
    max_discount_amount: number | null;
    usage_limit: number | null;
    usage_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Order Types
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

// User Types
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
}

export interface AuthUser extends User {
    token?: string;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Form Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface CheckoutFormData {
    shipping_address: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    billing_address?: {
        street: string;
        city: string;
        state: string;
        zip_code: string;
        country: string;
    };
    payment_method: 'credit_card' | 'paypal' | 'bank_transfer';
    coupon_code?: string;
}
