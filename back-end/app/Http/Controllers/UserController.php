<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::with('UserDetail')->get();
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch users.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with('UserDetail')->findOrFail($id);
            return response()->json($user);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'User not found.',
                'message' => 'The user with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to fetch user details: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch user details.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedUser = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $validatedDetails = $request->validate([
                'user_detail.bio' => 'sometimes|string|max:1000',
                'user_detail.date_of_birth' => 'sometimes|date',
                'user_detail.sex' => 'sometimes|in:Femme,Homme,Non binaire (X),Non déclaré (U)',
                'user_detail.accessibility_needs' => 'sometimes|string|max:255',
                'user_detail.phone_number' => 'sometimes|string|max:20',
                'user_detail.emergency_contact' => 'sometimes|string|max:255',
                'user_detail.address' => 'sometimes|string|max:1000',
                'user_detail.cin' => 'sometimes|string|max:20',
                'user_detail.icon' => 'sometimes|url|max:255',
            ], [
                'user_detail.*.string' => 'The :attribute field must be a string.',
                'user_detail.*.max' => 'The :attribute field must not exceed :max characters.',
                'user_detail.*.date' => 'The :attribute field must be a valid date.',
                'user_detail.*.in' => 'The :attribute field must be one of the following: Femme, Homme, Non binaire (X), Non déclaré (U).',
                'user_detail.*.url' => 'The :attribute field must be a valid URL.',
            ]);

            $userData = array_intersect_key($validatedUser, array_flip(['name', 'email', 'password']));
            $userData['password'] = Hash::make($userData['password']);
            $userData['role'] = 'guest';
            $user = User::create($userData);

            if (!empty($validatedDetails['user_detail'])) {
                $user->UserDetail()->create($validatedDetails['user_detail']);
            }

            $user->load('UserDetail');
            return response()->json($user, 201);
        } catch (\ValidationException $e) {
            Log::warning('Validation failed for user creation: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation failed.',
                'message' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create user: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create user.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validatedUser = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8|confirmed',
            ]);

            $validatedDetails = $request->validate([
                'user_detail.bio' => 'sometimes|string|max:1000',
                'user_detail.date_of_birth' => 'sometimes|date',
                'user_detail.sex' => 'sometimes|in:Femme,Homme,Non binaire (X),Non déclaré (U)',
                'user_detail.accessibility_needs' => 'sometimes|string|max:255',
                'user_detail.phone_number' => 'sometimes|string|max:20',
                'user_detail.emergency_contact' => 'sometimes|string|max:255',
                'user_detail.address' => 'sometimes|string|max:1000',
                'user_detail.cin' => 'sometimes|string|max:20',
                'user_detail.icon' => 'sometimes|url|max:255',
            ], [
                'user_detail.*.string' => 'The :attribute field must be a string.',
                'user_detail.*.max' => 'The :attribute field must not exceed :max characters.',
                'user_detail.*.date' => 'The :attribute field must be a valid date.',
                'user_detail.*.in' => 'The :attribute field must be one of the following: Femme, Homme, Non binaire (X), Non déclaré (U).',
                'user_detail.*.url' => 'The :attribute field must be a valid URL.',
            ]);

            if (isset($validatedUser['password'])) {
                $validatedUser['password'] = Hash::make($validatedUser['password']);
            }
            $user->update($validatedUser);

            if (!empty($validatedDetails['user_detail'])) {
                $user->UserDetail()->updateOrCreate(
                    ['user_id' => $user->id],
                    $validatedDetails['user_detail']
                );
            }

            $user->load('UserDetail');
            return response()->json($user);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'User not found.',
                'message' => 'The user with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\ValidationException $e) {
            Log::warning('Validation failed for user update: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation failed.',
                'message' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update user.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateCurrentUser(Request $request)
    {
        try {
            $user = $request->user();

            $validatedUser = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'password' => 'sometimes|string|min:8|confirmed',
            ]);

            $validatedDetails = $request->validate([
                'user_detail.bio' => 'sometimes|string|max:1000',
                'user_detail.date_of_birth' => 'sometimes|date',
                'user_detail.sex' => 'sometimes|in:Femme,Homme,Non binaire (X),Non déclaré (U)',
                'user_detail.accessibility_needs' => 'sometimes|string|max:255',
                'user_detail.phone_number' => 'sometimes|string|max:20',
                'user_detail.emergency_contact' => 'sometimes|string|max:255',
                'user_detail.address' => 'sometimes|string|max:1000',
                'user_detail.cin' => 'sometimes|string|max:20',
                'user_detail.icon' => 'sometimes|url|max:255',
            ], [
                'user_detail.*.string' => 'The :attribute field must be a string.',
                'user_detail.*.max' => 'The :attribute field must not exceed :max characters.',
                'user_detail.*.date' => 'The :attribute field must be a valid date.',
                'user_detail.*.in' => 'The :attribute field must be one of the following: Femme, Homme, Non binaire (X), Non déclaré (U).',
                'user_detail.*.url' => 'The :attribute field must be a valid URL.',
            ]);

            if (isset($validatedUser['password'])) {
                $validatedUser['password'] = Hash::make($validatedUser['password']);
            }
            $user->update($validatedUser);

            if (!empty($validatedDetails['user_detail'])) {
                $user->UserDetail()->updateOrCreate(
                    ['user_id' => $user->id],
                    $validatedDetails['user_detail']
                );
            }

            $user->load('UserDetail');
            return response()->json($user);
        } catch (\ValidationException $e) {
            Log::warning('Validation failed for current user update: ' . json_encode($e->errors()));
            return response()->json([
                'error' => 'Validation failed.',
                'message' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update current user: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update current user.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->UserDetail()->delete();
            $user->delete();

            return response()->json(['message' => 'User deleted successfully']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'User not found.',
                'message' => 'The user with ID ' . $id . ' does not exist.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to delete user: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete user.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}