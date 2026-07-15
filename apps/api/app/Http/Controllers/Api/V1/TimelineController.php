<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    public function show(Request $request)
    {
        $branchId = $request->attributes->get('branch_id');
        $date = $request->string('date')->toString() ?: now()->toDateString();

        $tables = RestaurantTable::query()
            ->where('branch_id', $branchId)
            ->orderBy('number')
            ->get(['id', 'number', 'capacity', 'status']);

        $reservations = Reservation::query()
            ->where('branch_id', $branchId)
            ->whereDate('starts_at', $date)
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->get(['id', 'table_id', 'status', 'starts_at', 'ends_at', 'guest_name', 'party_size', 'code']);

        $timeline = $tables->map(function ($table) use ($reservations) {
            return [
                'table' => $table,
                'blocks' => $reservations->where('table_id', $table->id)->values(),
            ];
        });

        return response()->json(['data' => $timeline, 'meta' => ['date' => $date]]);
    }
}
