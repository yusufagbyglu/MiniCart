"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/src/services/ProductService";
import type { Product } from "@/src/types";

// Query keys
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: string) => [...productKeys.lists(), { filters }] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: string | number) => [...productKeys.details(), id] as const,
};

// Get all products
export function useProducts() {
    return useQuery({
        queryKey: productKeys.lists(),
        queryFn: () => ProductService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Get product by slug
export function useProduct(slug: string) {
    return useQuery({
        queryKey: productKeys.detail(slug),
        queryFn: () => ProductService.getBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
    });
}

// Search products
export function useProductSearch(query: string) {
    return useQuery({
        queryKey: [...productKeys.lists(), 'search', query],
        queryFn: () => ProductService.search(query),
        enabled: query.length > 0,
        staleTime: 30 * 1000, // 30 seconds
    });
}
