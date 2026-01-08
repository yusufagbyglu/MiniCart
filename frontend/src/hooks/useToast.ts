"use client";

// Simple toast implementation
// For a production app, consider using a library like sonner or react-hot-toast

type ToastProps = {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
    // For now, we'll use console.log
    // In production, this should trigger a proper toast notification
    const prefix = variant === "destructive" ? "❌" : "✓";
    console.log(`${prefix} ${title}${description ? `: ${description}` : ""}`);

    // You can integrate with a toast library here
    // Example: import { toast as sonnerToast } from "sonner";
    // sonnerToast[variant === "destructive" ? "error" : "success"](title, { description });
}

export const useToast = () => {
    return { toast };
};
