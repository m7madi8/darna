<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;

        $customers = Customer::query()
            ->where('organization_id', $orgId)
            ->with('stats')
            ->when($request->string('q')->toString(), function ($q, $search) {
                $q->where(function ($b) use ($search) {
                    $b->where('name', 'ilike', "%{$search}%")
                        ->orWhere('phone', 'ilike', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(25);

        return CustomerResource::collection($customers);
    }

    public function show(Request $request, Customer $customer)
    {
        abort_unless((string) $customer->organization_id === (string) $request->user()->organization_id, 404);

        return new CustomerResource($customer->load([
            'stats',
            'notes',
            'reservations' => fn ($q) => $q->latest()->limit(20),
        ]));
    }
}
