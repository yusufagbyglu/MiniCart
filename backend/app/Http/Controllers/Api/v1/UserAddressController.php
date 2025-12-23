<?php

namespace App\Http\Controllers\Api\v1;

use App\Models\UserAddress;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserAddressResource;
use Illuminate\Http\Response; // Corrected: Using Illuminate\Http\Response
use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;

class UserAddressController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(UserAddress::class, 'user_address');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) // Corrected: Added Request $request parameter
    {
        $addresses = $request->user()->addresses;
        return UserAddressResource::collection($addresses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserAddressRequest $request)
    {
        $address = $request->user()->addresses()->create($request->validated());

        return new UserAddressResource($address);
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAddress $userAddress)
    {
        // Corrected: Removed manual authorization check, handled by policy
        return new UserAddressResource($userAddress);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserAddressRequest $request, UserAddress $userAddress)
    {
        // Corrected: Removed manual authorization check, handled by policy
        $userAddress->update($request->validated());

        return new UserAddressResource($userAddress);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAddress $userAddress)
    {
        // Corrected: Removed manual authorization check, handled by policy
        $userAddress->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
