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
- **UI Components**: shadcn/ui (Radix UI + Tailwind)

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
│   │   │   ├── dashboard/  # Overview stats
│   │   │   ├── products/   # Product management
│   │   │   ├── orders/     # Order management
│   │   │   ├── categories/ # Category management
│   │   │   ├── coupons/    # Coupon management
│   │   │   ├── users/      # User & role management
│   │   │   ├── audit/      # 🆕 Audit log viewer
│   │   │   ├── stock/      # 🆕 Stock tracking & alerts
│   │   │   └── reviews/    # 🆕 Review moderation (Pending approvals)
│   │   ├── cart/           # Shopping Cart page
│   │   ├── checkout/       # Multi-step checkout process
│   │   ├── dashboard/      # User account & order history
│   │   │   ├── profile/    # Profile settings
│   │   │   ├── orders/     # Order history
│   │   │   ├── addresses/  # 🆕 Address management (add/edit/delete)
│   │   │   ├── reviews/    # 🆕 User's submitted reviews
│   │   │   ├── notifications/ # 🆕 Notification center
│   │   │   └── settings/   # Account settings
│   │   ├── orders/
│   │   │   └── [orderNumber]/
│   │   │       └── track/  # 🆕 Order tracking page
│   │   │           └── page.tsx
│   │   ├── wishlist/       # 🆕 User wishlist page
│   │   │   └── page.tsx
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Tailwind & global styles
│   │
│   ├── components/
│   │   ├── ui/             # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/         # Navigation, Footer, Mobile Menu
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NotificationBell.tsx    # 🆕 Header notification icon
│   │   │   ├── NotificationDrawer.tsx  # 🆕 Notification side panel
│   │   │   └── CurrencySelector.tsx    # 🆕 Currency switcher
│   │   │
│   │   ├── product/        # Product related components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   ├── ProductImageGallery.tsx
│   │   │   ├── StockBadge.tsx          # 🆕 "Only 3 left!" warning
│   │   │   └── OutOfStockNotification.tsx # 🆕 "Notify when available"
│   │   │
│   │   ├── cart/           # Shopping cart components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   ├── QuickAddToCart.tsx
│   │   │   └── MiniCart.tsx
│   │   │
│   │   ├── checkout/       # Checkout flow components
│   │   │   ├── ShippingForm.tsx
│   │   │   ├── PaymentMock.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── CouponInput.tsx         # 🆕 Coupon code input
│   │   │   ├── CouponValidation.tsx    # 🆕 Real-time validation feedback
│   │   │   ├── AvailableCoupons.tsx    # 🆕 Available coupons list
│   │   │   └── TaxBreakdown.tsx        # 🆕 Tax details display
│   │   │
│   │   ├── review/         # 🆕 Review system components
│   │   │   ├── ReviewForm.tsx          # Write review form
│   │   │   ├── ReviewList.tsx          # Display reviews on product page
│   │   │   ├── RatingStars.tsx         # 5-star rating display
│   │   │   ├── ReviewModerationBadge.tsx # "Pending approval" indicator
│   │   │   └── ReviewFilter.tsx        # Filter by star rating
│   │   │
│   │   ├── wishlist/       # 🆕 Wishlist components
│   │   │   ├── WishlistButton.tsx      # Heart icon for product cards
│   │   │   ├── WishlistGrid.tsx        # Wishlist page grid
│   │   │   └── WishlistItem.tsx        # Individual wishlist item
│   │   │
│   │   ├── address/        # 🆕 Address management components
│   │   │   ├── AddressCard.tsx         # Display address with default badge
│   │   │   ├── AddressForm.tsx         # Add/Edit address form
│   │   │   ├── AddressSelector.tsx     # Select address in checkout
│   │   │   └── AddressTypeToggle.tsx   # Shipping/Billing toggle
│   │   │
│   │   ├── notification/   # 🆕 Notification components
│   │   │   ├── NotificationItem.tsx    # Single notification
│   │   │   ├── NotificationList.tsx    # List all notifications
│   │   │   └── NotificationBadge.tsx   # Unread count badge
│   │   │
│   │   ├── order/          # Order related components
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderTimeline.tsx       # 🆕 Order tracking timeline
│   │   │   └── TrackingInfo.tsx        # 🆕 Tracking number & carrier
│   │   │
│   │   └── admin/          # Admin specific components
│   │       ├── StatsCard.tsx
│   │       ├── DataTable.tsx
│   │       ├── StockAlert.tsx          # 🆕 Low stock warnings
│   │       └── AuditLogTable.tsx       # 🆕 Audit log display
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts              # Authentication state & actions
│   │   ├── useCart.ts              # Cart operations
│   │   ├── useLocalPersistence.ts  # LocalStorage sync
│   │   ├── usePermission.ts        # 🆕 Check user permissions
│   │   ├── useCurrency.ts          # 🆕 Active currency management
│   │   ├── useNotifications.ts     # 🆕 Polling/WebSocket for notifications
│   │   ├── useWishlist.ts          # 🆕 Wishlist operations
│   │   └── useDebounce.ts          # Debounce for search inputs
│   │
│   ├── lib/                # Configured instances & utilities
│   │   ├── axios.ts                # Axios instance with interceptors
│   │   ├── queryClient.ts          # TanStack Query configuration
│   │   ├── utils.ts                # General utility functions
│   │   ├── currencyFormatter.ts    # 🆕 Format prices with currency
│   │   └── validators.ts           # Form validation helpers
│   │
│   ├── services/           # API service layers
│   │   ├── AuthService.ts
│   │   ├── ProductService.ts
│   │   ├── CategoryService.ts
│   │   ├── CartService.ts
│   │   ├── OrderService.ts
│   │   ├── CouponService.ts
│   │   ├── WishlistService.ts      # 🆕 Wishlist API calls
│   │   ├── NotificationService.ts  # 🆕 Notification API calls
│   │   ├── ReviewService.ts        # 🆕 Review API calls
│   │   ├── AddressService.ts       # 🆕 Address CRUD operations
│   │   └── UserService.ts
│   │
│   ├── store/              # Zustand stores
│   │   ├── useCartStore.ts
│   │   ├── useUserStore.ts
│   │   ├── useWishlistStore.ts     # 🆕 Wishlist state
│   │   ├── useCurrencyStore.ts     # 🆕 Currency state
│   │   └── useNotificationStore.ts # 🆕 Notification state
│   │
│   ├── types/              # TypeScript interfaces/types
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── coupon.ts
│   │   ├── review.ts               # 🆕 Review types
│   │   ├── wishlist.ts             # 🆕 Wishlist types
│   │   ├── notification.ts         # 🆕 Notification types
│   │   ├── address.ts              # 🆕 Address types
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   └── middleware.ts       # 🆕 Next.js middleware for route guards
│
├── tailwind.config.ts      # Custom theme (Premium Slate, Emerald, Gold)
├── next.config.js
├── tsconfig.json
├── .env.local
└── package.json
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
