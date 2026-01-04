<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index()
    {
        return response()->json(Coupon::latest()->paginate(20));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric',
            'min_order_amount' => 'nullable|numeric',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after:valid_from',
            'max_uses' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        $coupon = Coupon::create($validated);
        return response()->json($coupon, 201);
    }

    public function show($id)
    {
        return response()->json(Coupon::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|unique:coupons,code,' . $id,
            'discount_type' => 'sometimes|in:percentage,fixed',
            'discount_value' => 'sometimes|numeric',
            'min_order_amount' => 'nullable|numeric',
            'valid_from' => 'sometimes|date',
            'valid_until' => 'sometimes|date|after:valid_from',
            'max_uses' => 'nullable|integer',
            'is_active' => 'boolean'
        ]);

        $coupon->update($validated);
        return response()->json($coupon);
    }

    public function destroy($id)
    {
        Coupon::destroy($id);
        return response()->json(['message' => 'Coupon deleted']);
    }
}
