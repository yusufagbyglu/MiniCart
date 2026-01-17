<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use App\Data\CouponData;
use App\Http\Resources\CouponResource;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Coupon::class);

        $query = Coupon::query();

        // Search by code
        $query->when($request->query('search'), function ($query, $search) {
            $query->where('code', 'like', "%{$search}%");
        });

        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->query('per_page', 20);

        return CouponResource::collection($query->paginate($perPage));
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
