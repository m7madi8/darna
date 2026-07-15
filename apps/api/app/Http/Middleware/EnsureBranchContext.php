<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBranchContext
{
    /**
     * Read X-Branch-Id, verify access, and bind the branch to the request and container.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $branchId = $request->header('X-Branch-Id');

        if (! $branchId) {
            return response()->json([
                'message' => 'X-Branch-Id header is required.',
            ], 422);
        }

        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (! $user->canAccessBranch($branchId)) {
            return response()->json([
                'message' => 'You do not have access to this branch.',
            ], 403);
        }

        $branch = Branch::query()
            ->whereKey($branchId)
            ->where('organization_id', $user->organization_id)
            ->where('is_active', true)
            ->first();

        if (! $branch) {
            return response()->json([
                'message' => 'You do not have access to this branch.',
            ], 403);
        }

        $request->attributes->set('branch', $branch);
        $request->attributes->set('branch_id', $branch->id);

        app()->instance('currentBranch', $branch);
        app()->instance(Branch::class, $branch);

        return $next($request);
    }
}
