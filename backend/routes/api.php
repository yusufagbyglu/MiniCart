<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UserController;


Route::get('/sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
// Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware(['auth:sanctum'])->post('/logout', [UserController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'user']);


// Route::get('/test-route', function() {
//     return ['status' => 'ok'];
// });


// Route::middleware('web')->group(function() {
//     Route::get('/sanctum/csrf-cookie', [\Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show']);
//     Route::post('/register', [UserController::class, 'register']);
//     Route::post('/login', [UserController::class, 'login']);
//     Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'user']);
// });