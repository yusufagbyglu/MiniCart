<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

class RoleData extends Data
{
    public function __construct(
        public string $name,
        public ?string $description,
    ) {
    }

    public static function rules($context = null): array
    {
        $role = request()->route('role');
        $roleId = is_object($role) ? $role->id : $role;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($roleId)
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
