export interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    user?: {
        name: string;
    };
}
