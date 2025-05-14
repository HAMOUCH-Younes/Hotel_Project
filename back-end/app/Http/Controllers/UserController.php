<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('userDetail')->get();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with('userDetail')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validatedUser = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|in:guest,admin',
        ]);

        $validatedDetails = $request->validate([
            'bio' => 'sometimes|string|max:1000',
            'date_of_birth' => 'sometimes|date',
            'sex' => 'sometimes|in:Femme,Homme,Non binaire (X),Non déclaré (U)',
            'accessibility_needs' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|string|max:20',
            'emergency_contact' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:1000',
            'cin' => 'sometimes|string|max:20',
            'icon' => 'sometimes|string|max:255', // Add icon validation
        ]);

        if (isset($validatedUser['password'])) {
            $validatedUser['password'] = Hash::make($validatedUser['password']);
        }
        $user->update($validatedUser);

        $user->userDetail()->updateOrCreate(
            ['user_id' => $user->id],
            $validatedDetails
        );

        $user->load('userDetail');
        return response()->json($user);
    }

    public function updateCurrentUser(Request $request)
    {
        $user = $request->user();

        $validatedUser = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $validatedDetails = $request->validate([
            'bio' => 'sometimes|string|max:1000',
            'date_of_birth' => 'sometimes|date',
            'sex' => 'sometimes|in:Femme,Homme,Non binaire (X),Non déclaré (U)',
            'accessibility_needs' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|string|max:20',
            'emergency_contact' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:1000',
            'cin' => 'sometimes|string|max:20',
            'icon' => 'sometimes|string|max:255', // Add icon validation
        ]);

        if (isset($validatedUser['password'])) {
            $validatedUser['password'] = Hash::make($validatedUser['password']);
        }
        $user->update($validatedUser);

        $user->userDetail()->updateOrCreate(
            ['user_id' => $user->id],
            $validatedDetails
        );

        $user->load('userDetail');
        return response()->json($user);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}