export interface Address {
    id?: number;
    user_id?: number;
    type: 'shipping' | 'billing';
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    is_default: boolean;
    created_at?: string;
    updated_at?: string;
}
