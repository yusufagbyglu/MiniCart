<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\CategoryController;
use App\Http\Controllers\Api\v1\ProductController;
use App\Http\Controllers\Api\v1\CartController;
use App\Http\Controllers\Api\v1\OrderController;
use App\Http\Controllers\Api\v1\ReviewController;
use App\Http\Controllers\Api\v1\WishlistController;
use App\Http\Controllers\Api\v1\PaymentController;


use App\Http\Controllers\Api\v1\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\v1\Admin\CouponController;
use App\Http\Controllers\Api\v1\Admin\TaxRateController;
use App\Http\Controllers\Api\v1\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Auth routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Public Product & Review Viewing
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{product:slug}', [ProductController::class, 'show']);
    Route::get('/products/categories', [ProductController::class, 'categories']);
    Route::get('/products/categories/{category}/products', [
        ProductController::class,
        'categoryProducts'
    ]);
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
    // Route::get('/reviews/{review}', [ReviewController::class, 'show']);

    // Public Category Routes
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/tree', [CategoryController::class, 'getTree']);
    Route::get('/categories/parent-categories', [CategoryController::class, 'getParentCategories']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::get('/categories/{category}/children', [CategoryController::class, 'getChildren']);
    Route::get('/categories/{category}/descendants', [CategoryController::class, 'getDescendants']);
    Route::get('/categories/{category}/breadcrumb', [CategoryController::class, 'getBreadcrumb']);

    // Cart Routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/items', [CartController::class, 'store']);
        Route::put('/items/{itemId}', [CartController::class, 'update']);
        Route::delete('/items/{itemId}', [CartController::class, 'destroy']);
        Route::post('/apply-coupon', [CartController::class, 'applyCoupon']);
        Route::delete('/remove-coupon', [CartController::class, 'removeCoupon']);
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh-token', [AuthController::class, 'refresh']);


        // Route::get('/auth/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        //     ->name('verification.verify');
        // Route::post('/auth/email/verification-notification', [AuthController::class, 'resendVerificationEmail']);

        //User profile
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);

        // User Addresses
        Route::apiResource('/user/addresses', \App\Http\Controllers\Api\v1\UserAddressController::class);

        // Order Routes
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
        Route::post('/orders/{orderNumber}/cancel', [OrderController::class, 'cancel']);

        // Payment Routes
        Route::post('/payments/process', [PaymentController::class, 'process']);
        Route::get('/payments/{orderId}/status', [PaymentController::class, 'status']);

        // Review Routes
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // Wishlist Routes
        Route::get('/user/wishlist', [WishlistController::class, 'index']);
        Route::post('/user/wishlist/{productId}', [WishlistController::class, 'store']);
        Route::delete('/user/wishlist/{productId}', [WishlistController::class, 'destroy']);

    });

    // Admin routes
    Route::middleware(['auth:sanctum', 'role:support,admin'])->prefix('support')->group
    (function () {
        // Support can manage all reviews, not just their own.
        // Route::put('/reviews/{review}', [ReviewController::class, 'update']);        
        // Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);    
    });

    // Shop Manager Routes (Role: 'shop-manager' or 'admin')
    Route::middleware(['auth:sanctum', 'role:shop-manager,admin'])->prefix('management')->group
    (function () {
        // Product Management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product:slug}', [ProductController::class, 'update']);
        Route::delete('/products/{product:slug}', [ProductController::class, 'destroy']);
        Route::post('/products/{product:slug}/images', [ProductController::class, 'addImage']);
        Route::delete('/products/{product:slug}/images/{image}', [ProductController::class, 'removeImage']);

        // Category Management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    });

    // Admin-Only Routes (Role: 'admin')
    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(
        function () {
            // User Management
            Route::apiResource('users', UserController::class);
            Route::post('/users/{user}/roles', [UserController::class, 'assignRole']);
            Route::delete('/users/{user}/roles/{role}', [UserController::class, 'removeRole']);

            // Role Management
            Route::apiResource('roles', RoleController::class);
            Route::post('/roles/{role}/permissions', [RoleController::class, 'assignPermission']);
            Route::delete('/roles/{role}/permissions/{permission}', [RoleController::class, 'removePermission']);

            // Admin Order Management
            Route::get('/orders/stats', [AdminOrderController::class, 'stats']);
            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
            Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

            // Coupon Management
            Route::apiResource('coupons', CouponController::class);

            // Tax Management
            Route::apiResource('tax-rates', TaxRateController::class);

            // Site-wide Statistics & Imports (Existing)
            Route::get('/products/stats', [ProductController::class, 'stats']);
            Route::post('/products/import', [ProductController::class, 'import']);
        }
    );
});