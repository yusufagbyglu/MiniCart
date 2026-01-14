import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "MiniCart | Premium Shopping Experience",
    description: "Experience the next level of e-commerce with MiniCart.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={cn(
                    inter.variable,
                    outfit.variable,
                    "min-h-screen bg-background font-sans antialiased"
                )}
            >
                <QueryProvider>
                    {children}
                    <Toaster />
                </QueryProvider>
            </body>
        </html>
    );
}
