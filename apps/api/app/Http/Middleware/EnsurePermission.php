<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePermission
{
    /**
     * Ensure the authenticated user has the given permission for the current branch.
     *
     * Usage: ->middleware('permission:reservations.create')
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $branchId = $request->attributes->get('branch_id')
            ?? $request->header('X-Branch-Id');

        if (! $user->hasPermission($permission, $branchId ? (string) $branchId : null)) {
            return response()->json([
                'message' => 'You do not have permission to perform this action.',
                'required_permission' => $permission,
            ], 403);
        }

        return $next($request);
    }
}
