<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use App\Data\CouponData;

class CouponController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Coupon::class);
        return response()->json(Coupon::latest()->paginate(20));
    }

    public function store(CouponData $data)
    {
        $this->authorize('create', Coupon::class);
        $coupon = Coupon::create($data->toArray());
        return response()->json($coupon, 201);
    }

    public function show($id)
    {
        $coupon = Coupon::findOrFail($id);
        $this->authorize('view', $coupon);
        return response()->json($coupon);
    }

    public function update(CouponData $data, $id)
    {
        $coupon = Coupon::findOrFail($id);
        $this->authorize('update', $coupon);

        $coupon->update($data->toArray());
        return response()->json($coupon);
    }

    public function destroy($id)
    {
        $coupon = Coupon::findOrFail($id);
        $this->authorize('delete', $coupon);
        $coupon->delete();
        return response()->json(['message' => 'Coupon deleted']);
    }
}
