<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Exception;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'sometimes|in:guest,admin',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'] ?? 'guest',
            ]);

            if (!$user) {
                Log::error('Failed to create user', ['email' => $validated['email']]);
                return response()->json(['message' => 'Failed to create user. Please try again.'], 500);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            if (!$token) {
                Log::error('Failed to generate token for user', ['user_id' => $user->id]);
                return response()->json(['message' => 'Failed to generate authentication token.'], 500);
            }

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            Log::error('Registration error', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Unexpected error: ' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($validated)) {
                return response()->json([
                    'message' => 'Invalid credentials. Please check your email or password.',
                ], 401);
            }

            $user = Auth::user();
            if (!$user) {
                Log::error('User not found after authentication attempt', ['email' => $validated['email']]);
                return response()->json(['message' => 'User not found.'], 404);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            if (!$token) {
                Log::error('Failed to generate token for user', ['user_id' => $user->id]);
                return response()->json(['message' => 'Failed to generate authentication token.'], 500);
            }

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            Log::error('Login error', [
                'error' => $e->getMessage(),
                'email' => $request->email,
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json(['message' => 'Unexpected error: ' . $e->getMessage()], 500);
        }
    }
}