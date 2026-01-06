<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use App\Data\TaxRateData;
use Illuminate\Http\Request;

class TaxRateController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', TaxRate::class);
        return response()->json(TaxRate::paginate(15));
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
