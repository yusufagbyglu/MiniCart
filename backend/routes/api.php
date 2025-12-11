<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\V1\PermissionController;
use App\Http\Controllers\Api\V1\RoleController;

// Route::get('/sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);


// Route::post('/register', [UserController::class, 'register']);
// Route::post('/login', [UserController::class, 'login']);
// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/logout', [UserController::class, 'logout']);
//     Route::get('/user', [UserController::class, 'user']);
// });


// Route::post('/tokens/create', function (Request $request) {
//     $token = $request->user()->createToken($request->token_name);
 
//     return ['token' => $token->plainTextToken];
// });


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::get('/user',       [AuthController::class, 'user']);

    // User Management Routes
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    Route::apiResource('roles', RoleController::class);
    Route::apiResource('permissions', PermissionController::class);

    Route::post('users/{user}/roles/{role}', [UserController::class, 'assignRole']);
    Route::delete('users/{user}/roles/{role}', [UserController::class, 'removeRole']);
    Route::post('roles/{role}/permissions/{permission}', [RoleController::class, 'assignPermission']);
    Route::delete('roles/{role}/permissions/{permission}', [RoleController::class, 'removePermission']);
});