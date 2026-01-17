<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use App\Data\TaxRateData;
use Illuminate\Http\Request;
use App\Http\Resources\TaxRateResource;

class TaxRateController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', TaxRate::class);

        $query = TaxRate::query();

        // Search by name or country
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%");
            });
        });

        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->query('per_page', 15);

        return TaxRateResource::collection($query->paginate($perPage));
    }

    public function store(TaxRateData $data)
    {
        $this->authorize('create', TaxRate::class);
        $taxRate = TaxRate::create($data->toArray());
        return response()->json($taxRate, 201);
    }

    public function show(TaxRate $taxRate)
    {
        $this->authorize('view', $taxRate);
        return response()->json($taxRate);
    }

    public function update(TaxRateData $data, TaxRate $taxRate)
    {
        $this->authorize('update', $taxRate);
        $taxRate->update($data->toArray());
        return response()->json($taxRate);
    }

    public function destroy(TaxRate $taxRate)
    {
        $this->authorize('delete', $taxRate);
        $taxRate->delete();
        return response()->json(null, 204);
    }
}
