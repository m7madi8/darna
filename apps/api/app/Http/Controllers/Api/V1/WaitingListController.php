<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\WaitingList\StoreWaitingListRequest;
use App\Http\Resources\ReservationResource;
use App\Models\WaitingListEntry;
use App\Services\ReservationService;
use Illuminate\Http\Request;

class WaitingListController extends Controller
{
    public function __construct(private readonly ReservationService $reservations) {}

    public function index(Request $request)
    {
        $entries = WaitingListEntry::query()
            ->where('branch_id', $request->attributes->get('branch_id'))
            ->latest()
            ->paginate(25);

        return response()->json($entries);
    }

    public function store(StoreWaitingListRequest $request)
    {
        $entry = WaitingListEntry::query()->create([
            ...$request->validated(),
            'branch_id' => $request->attributes->get('branch_id'),
            'status' => 'waiting',
        ]);

        return response()->json(['data' => $entry], 201);
    }

    public function convert(Request $request, WaitingListEntry $waitingList)
    {
        abort_unless((string) $waitingList->branch_id === (string) $request->attributes->get('branch_id'), 404);

        $data = $request->validate([
            'starts_at' => ['required', 'date'],
            'table_id' => ['nullable', 'uuid'],
        ]);

        $branch = $request->attributes->get('branch');

        $reservation = $this->reservations->create([
            'organization_id' => $branch->organization_id,
            'branch_id' => $branch->id,
            'guest_name' => $waitingList->guest_name,
            'guest_phone' => $waitingList->guest_phone,
            'party_size' => $waitingList->party_size,
            'starts_at' => $data['starts_at'],
            'table_id' => $data['table_id'] ?? null,
            'notes' => $waitingList->notes,
        ], $request->user(), 'waiting_list');

        $waitingList->update([
            'status' => 'converted',
            'converted_reservation_id' => $reservation->id,
        ]);

        return response()->json([
            'data' => [
                'waiting_list' => $waitingList->fresh(),
                'reservation' => new ReservationResource($reservation),
            ],
        ]);
    }
}
