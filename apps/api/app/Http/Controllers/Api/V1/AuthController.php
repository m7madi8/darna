<?php



namespace App\Http\Controllers\Api\V1;



use App\Http\Controllers\Controller;

use App\Http\Requests\Auth\LoginRequest;

use App\Http\Resources\UserResource;

use App\Models\User;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use Illuminate\Validation\ValidationException;



class AuthController extends Controller

{

    public function login(LoginRequest $request)

    {

        if (! Auth::attempt($request->validated(), true)) {

            throw ValidationException::withMessages([

                'email' => ['Invalid credentials.'],

            ]);

        }



        /** @var User $user */

        $user = $request->user();

        $request->session()->regenerate();



        $user->load(['organization', 'branches', 'roles.permissions']);

        $branchId = $request->header('X-Branch-Id') ?? $user->branches->first()?->id;



        return (new UserResource($user))->additional([

            'meta' => [

                'permissions' => $user->permissionSlugs($branchId ? (string) $branchId : null),

                'active_branch_id' => $branchId,

            ],

        ]);

    }



    public function logout(Request $request)

    {

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();



        return response()->json(['message' => 'Logged out']);

    }



    public function me(Request $request)

    {

        $user = $request->user()->load(['organization', 'branches', 'roles.permissions']);

        $branchId = $request->header('X-Branch-Id') ?? $user->branches->first()?->id;



        return (new UserResource($user))->additional([

            'meta' => [

                'permissions' => $user->permissionSlugs($branchId ? (string) $branchId : null),

                'active_branch_id' => $branchId,

            ],

        ]);

    }

}


