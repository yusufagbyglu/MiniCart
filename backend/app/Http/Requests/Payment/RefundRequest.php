<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class RefundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled in controller/policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string|in:customer_request,product_defect,wrong_item,not_received,duplicate_charge,other',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'amount.required' => 'Refund amount is required.',
            'amount.numeric' => 'Refund amount must be a number.',
            'amount.min' => 'Refund amount must be at least 0.01.',
            'reason.required' => 'Refund reason is required.',
            'reason.in' => 'Invalid refund reason selected.',
        ];
    }
}
