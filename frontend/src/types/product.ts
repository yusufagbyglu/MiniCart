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

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
