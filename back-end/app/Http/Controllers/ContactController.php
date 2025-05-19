<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        try {
            $contacts = Contact::with('user')->get();
            return response()->json($contacts);
        } catch (\Exception $e) {
            Log::error('Failed to fetch contacts: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch contacts.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['error' => 'User not authenticated.'], 401);
            }

            $validated = $request->validate([
                'phone_country_code' => 'nullable|string|max:10',
                'phone_number' => 'nullable|string|max:15',
                'sms_updates' => 'boolean',
                'emergency_contact_name' => 'nullable|string|max:255',
                'emergency_country_code' => 'nullable|string|max:10',
                'emergency_number' => 'nullable|string|max:15',
                'email' => 'required|email|max:255',
                'country' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:255',
                'address_details' => 'nullable|string|max:255',
                'city' => 'nullable|string|max:100',
                'state' => 'nullable|string|max:100',
                'postal_code' => 'nullable|string|max:20',
                'name' => 'nullable|string|max:255', // Added for completeness
            ]);

            $contact = Contact::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($validated, ['user_id' => $user->id, 'name' => $validated['name'] ?? $user->name])
            );

            $contact->load('user');
            return response()->json($contact, 201);
        } catch (\Exception $e) {
            Log::error('Failed to store contact: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to store contact.'], 500);
        }
    }

    public function usersWithoutContacts()
    {
        try {
            $users = User::leftJoin('contacts', 'users.id', '=', 'contacts.user_id')
                ->leftJoin('user_details', 'users.id', '=', 'user_details.user_id')
                ->select('users.id', 'users.name', 'users.email', 'user_details.phone_number', 'user_details.emergency_contact', 'user_details.address')
                ->whereNull('contacts.user_id')
                ->get();

            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Failed to fetch users without contacts: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users without contacts.'], 500);
        }
    }
}