<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\UserController;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\ProductController;


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

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{product:slug}', [ProductController::class, 'show']);
    Route::get('/products/categories', [ProductController::class, 'categories']);
    Route::get('/products/categories/{category}/products', [ProductController::class, 'categoryProducts']);

    // Reviews
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
    Route::get('/reviews/{review}', [ReviewController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh-token', [AuthController::class, 'refresh']);
        Route::get('/auth/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
            ->name('verification.verify');
        Route::post('/auth/email/verification-notification', [AuthController::class, 'resendVerificationEmail']);

        // User profile
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::put('/user/profile', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);

        // Addresses
        Route::apiResource('user/addresses', AddressController::class);

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::put('/cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
        Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon']);
        Route::delete('/cart/remove-coupon', [CartController::class, 'removeCoupon']);
        Route::get('/cart/summary', [CartController::class, 'summary']);

        // Orders
        Route::post('/orders/checkout', [OrderController::class, 'checkout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order:order_number}', [OrderController::class, 'show']);
        Route::post('/orders/{order:order_number}/cancel', [OrderController::class, 'cancel']);
        Route::post('/orders/{order:order_number}/return', [OrderController::class, 'return']);
        Route::get('/orders/{order:order_number}/invoice', [OrderController::class, 'invoice']);

        // Payments
        Route::post('/payments/{order}/process', [PaymentController::class, 'process']);
        Route::get('/payments/{order}/status', [PaymentController::class, 'status']);

        // Reviews
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // Admin routes
        Route::middleware(['role:admin'])->prefix('admin')->group(function () {
            // Products
            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product:slug}', [ProductController::class, 'update']);
            Route::delete('/products/{product:slug}', [ProductController::class, 'destroy']);
            Route::post('/products/{product:slug}/images', [ProductController::class, 'addImage']);
            Route::delete('/products/{product:slug}/images/{image}', [ProductController::class, 'removeImage']);
            Route::post('/products/import', [ProductController::class, 'import']);
            Route::get('/products/stats', [ProductController::class, 'stats']);

            // Orders
            Route::get('/orders', [OrderController::class, 'adminIndex']);
            Route::put('/orders/{order:order_number}/status', [OrderController::class, 'updateStatus']);
            Route::get('/orders/stats', [OrderController::class, 'stats']);

            // Users
            Route::apiResource('users', UserController::class);
            
            // Coupons
            Route::apiResource('coupons', CouponController::class);
            
            // Tax rates
            Route::apiResource('tax-rates', TaxRateController::class);
            
            // Reviews
            Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve']);
            
            // Payments
            Route::post('/payments/{payment}/refund', [PaymentController::class, 'refund']);
        });
    });
});