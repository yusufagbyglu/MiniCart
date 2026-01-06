<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Illuminate\Validation\Rule;

class UserData extends Data
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $password,
    ) {
    }

    public static function rules($context = null): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
        ];

        if (request()->isMethod('POST')) {
            $rules['email'][] = Rule::unique('users', 'email');
            $rules['password'] = ['required', 'string', 'min:8'];
        }

        if (request()->isMethod('PUT') || request()->isMethod('PATCH')) {
            $user = request()->route('user');
            $userId = is_object($user) ? $user->id : $user;
            $rules['email'][] = Rule::unique('users', 'email')->ignore($userId);
            $rules['name'] = ['sometimes', 'required', 'string', 'max:255'];
            $rules['email'] = ['sometimes', 'required', 'email', 'max:255'];
        }

        return $rules;
    }
}
