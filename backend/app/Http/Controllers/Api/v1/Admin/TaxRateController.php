<?php

namespace App\Http\Controllers\Api\v1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use Illuminate\Http\Request;

class TaxRateController extends Controller
{
    public function index()
    {
        return response()->json(TaxRate::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'country' => 'required|string|size:2', // alpha-2 code usually
            'state' => 'nullable|string',
            'rate' => 'required|numeric|min:0|max:100',
            'tax_type' => 'required|in:vat,sales,gst,hst,pst,service,custom',
            'is_active' => 'boolean'
        ]);

        $taxRate = TaxRate::create($validated);
        return response()->json($taxRate, 201);
    }

    public function update(Request $request, $id)
    {
        $taxRate = TaxRate::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'country' => 'sometimes|string|size:2',
            'state' => 'nullable|string',
            'rate' => 'sometimes|numeric|min:0|max:100',
            'tax_type' => 'sometimes|in:vat,sales,gst,hst,pst,service,custom',
            'is_active' => 'boolean'
        ]);

        $taxRate->update($validated);
        return response()->json($taxRate);
    }

    public function destroy($id)
    {
        TaxRate::destroy($id);
        return response()->json(['message' => 'Tax Rate deleted']);
    }
}
