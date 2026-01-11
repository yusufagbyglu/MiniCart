import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/QueryProvider";

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
                    <Navbar />
                    <main className="relative flex min-h-screen flex-col pt-20">
                        {children}
                    </main>
                    <Footer />
                </QueryProvider>
            </body>
        </html>
    );
}
