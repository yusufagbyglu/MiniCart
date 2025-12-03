<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email|unique:users,email',
            'password'=>'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password),
        ]);

        //$user->sendEmailVerificationNotification();

        Auth::login($user);

        return response()->json($user);
    }

    // public function login(Request $request)
    // {
    //     $credentials = $request->only('email','password');

    //     if (Auth::attempt($credentials)) {
    //         $request->session()->regenerate();
    //         // return response()->json(Auth::user());
    //         return response()->json([
    //         'message' => 'Login successful!',
    //     ]);
    //     }
    //     return response()->json(['message'=>'Invalid credentials'], 401);
    // }

    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    
    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful!',
        'token' => $token,
        'user' => $user
    ]);
}

    public function logout(Request $request)
    {
        // Auth::logout();
        Auth::guard()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return response()->json(['message'=>'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}