<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employees\StoreEmployeeRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->where('organization_id', $request->user()->organization_id)
            ->with(['roles', 'branches'])
            ->paginate(25);

        return UserResource::collection($users);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();

        $user = User::query()->create([
            'organization_id' => $request->user()->organization_id,
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'is_active' => true,
        ]);

        if (! empty($data['branch_ids'])) {
            $sync = [];
            foreach ($data['branch_ids'] as $index => $branchId) {
                $sync[$branchId] = [
                    'id' => (string) Str::uuid(),
                    'is_primary' => $index === 0,
                ];
            }
            $user->branches()->sync($sync);
        }

        if (! empty($data['role_id'])) {
            $user->roles()->attach($data['role_id'], [
                'id' => (string) Str::uuid(),
                'branch_id' => $request->attributes->get('branch_id'),
            ]);
        }

        return (new UserResource($user->load(['roles', 'branches'])))->response()->setStatusCode(201);
    }

    public function update(Request $request, User $user)
    {
        abort_unless((string) $user->organization_id === (string) $request->user()->organization_id, 404);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'phone' => ['nullable', 'string', 'max:40'],
            'is_active' => ['boolean'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return new UserResource($user->fresh(['roles', 'branches']));
    }
}
