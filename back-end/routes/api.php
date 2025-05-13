<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\ReviewController;

use App\Http\Middleware\EnsureAdmin;

// 🔓 Public Routes (no auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::get('/amenities', [AmenityController::class, 'index']);
Route::get('/offers', [OfferController::class, 'index']);
Route::get('/offers/{id}', [OfferController::class, 'show']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{id}', [ReviewController::class, 'show']);
Route::post('/rooms/{id}/check-availability', [RoomController::class, 'checkAvailability']);

// 🔐 Authenticated User Routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // ✅ General user actions
    Route::get('/user', function (Request $request) {
        return $request->user()->load('userDetail');
    });
    Route::put('/user', [UserController::class, 'updateCurrentUser']); // Added route to update current user
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);


    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // 🔒 Admin Only Routes
    Route::middleware([EnsureAdmin::class])->group(function () {
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Room management
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{id}', [RoomController::class, 'update']);
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
    });
});