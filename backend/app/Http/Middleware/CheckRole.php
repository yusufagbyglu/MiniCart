<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * Checks if the user has at least one of the required roles.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles  The roles to check for, passed from the route definition.
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // If there is no authenticated user, deny access with a 401 Unauthorized response.
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // This assumes your User model has a `roles` relationship.
        // e.g., public function roles() { return $this->belongsToMany(Role::class, 'user_roles'); }
        // The middleware will check if the user's roles contain any of the roles required by the route.
        foreach ($roles as $role) {
            // The `contains` method on the collection checks if a role with the matching 'name' exists.
            if ($user->roles->contains('name', $role)) {
                // If the user has one of the required roles, allow the request to proceed.
                return $next($request);
            }
        }

        // If the user does not have any of the required roles, return a 403 Forbidden response.
        return response()->json([
            'message' => 'Forbidden. You do not have the required permissions to access this resource.'
        ], 403);
    }
}
