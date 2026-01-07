# MiniCart Frontend Application Plan

This document outlines the architecture, file structure, and design strategy for the MiniCart Next.js frontend.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: 
    - **Server State**: TanStack Query (React Query)
    - **Client State**: Zustand (Lightweight, performant)
- **API Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion

---

## Directory Structure

```text
frontend/
├── public/                 # Static assets (logos, fallback images)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Grouped Auth routes (login, register, forgot-password)
│   │   ├── (shop)/         # Main shop layout group
│   │   │   ├── products/   # Product listing & search
│   │   │   ├── [slug]/     # Product details (Dynamic Route)
│   │   │   └── page.tsx    # Home Page (Featured products/categories)
│   │   ├── admin/          # Admin Dashboard & management
│   │   ├── cart/           # Shopping Cart page
│   │   ├── checkout/       # Multi-step checkout process
│   │   ├── dashboard/      # User account & order history
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Tailwind & global styles
│   ├── components/
│   │   ├── ui/             # Reusable base components (Button, Input, Badge, Modal)
│   │   ├── layout/         # Navigation, Footer, Mobile Menu
│   │   ├── product/        # ProductCard, PriceDisplay, ProductGrid
│   │   ├── cart/           # CartDrawer, CartItem, QuickAdd
│   │   └── checkout/       # ShippingForm, PaymentMock, OrderSummary
│   ├── hooks/              # Custom React hooks (useAuth, useCart, useLocalPersistence)
│   ├── lib/                # Configured instances (axios, queryClient, utils)
│   ├── services/           # API service layers (AuthService, ProductService, OrderService)
│   ├── store/              # Zustand stores (useCartStore, useUserStore)
│   └── types/              # TypeScript interfaces/types matching Backend DTOs
├── tailwind.config.ts      # Custom theme colors (Premium Slate, Emerald, Gold)
├── next.config.js
└── tsconfig.json
```

---

## Core MVP Features

### 1. Immersive Home Page
- **Hero Section**: Dynamic high-quality image (generated) with "Shop Now" call-to-action.
- **Featured Categories**: Hover-animated cards leading to category listings.
- **Bestsellers**: Carousel of top-rated products using `ProductCard`.

### 2. Advanced Product Discovery
- **Search**: Real-time filtering via the `/api/v1/products/search` endpoint.
- **Server-Side Rendering (SSR)**: Product detail pages optimized for SEO with dynamic metadata.
- **Glassmorphism UI**: Product cards with subtle blurs and backdrop filters.

### 3. Shopping Cart Experience
- **Drawer System**: Side-sliding cart for quick access without leaving the current page.
- **Persistence**: Cart data synced with Backend for logged-in users, stored in `localStorage` for guests.
- **Micro-interactions**: Subtle bounce animations when adding items to the cart.

### 4. Seamless Checkout
- **Mock Payment**: A "wow" factor UI for credit card entry (using `react-payment-inputs` or similar logic).
- **Address Selection**: Integration with saved user addresses from the backend.

### 5. Admin Dashboard
- **Stats Overview**: Visual cards for Total Revenue, Orders, and Stock alerts.
- **Management**: Simple tables for managing products and order statuses.

---

## API Integration Strategy

### Axios Interceptors
Global interceptors to attach the `Bearer {token}` from Sanctum and handle `401 Unauthorized` errors by redirecting to the login page.

### TanStack Query
Use `useQuery` for fetching products/categories and `useMutation` for actions like `addToCart` or `submitOrder`. This provides built-in loading states, caching, and revalidation.

---

## Design System (Tailwind)
- **Primary**: Indigo/Emerald (Vibrant but professional)
- **Surface**: Translucent whites/blacks for Glassmorphism
- **Typography**: Inter or Outfit for a modern tech feel
- **Transitions**: Smooth `ease-in-out` for all hover and state changes.
