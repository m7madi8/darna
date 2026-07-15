<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $branchId = $request->attributes->get('branch_id');
        $today = now()->toDateString();

        $base = Reservation::query()->where('branch_id', $branchId)->whereDate('starts_at', $today);

        $tables = RestaurantTable::query()->where('branch_id', $branchId);

        return response()->json([
            'data' => [
                'todays_reservations' => (clone $base)->count(),
                'pending_requests' => (clone $base)->where('status', 'pending')->count(),
                'approved' => (clone $base)->where('status', 'approved')->count(),
                'occupied_tables' => (clone $tables)->where('status', 'occupied')->count(),
                'free_tables' => (clone $tables)->where('status', 'available')->count(),
                'completed' => (clone $base)->where('status', 'completed')->count(),
                'cancelled' => (clone $base)->where('status', 'cancelled')->count(),
                'no_shows' => (clone $base)->where('status', 'no_show')->count(),
                'occupancy_percentage' => $this->occupancy($branchId),
            ],
        ]);
    }

    private function occupancy(string $branchId): float
    {
        $total = RestaurantTable::query()->where('branch_id', $branchId)->count();
        if ($total === 0) {
            return 0;
        }

        $busy = RestaurantTable::query()
            ->where('branch_id', $branchId)
            ->whereIn('status', ['reserved', 'occupied', 'vip_reserved', 'pending'])
            ->count();

        return round(($busy / $total) * 100, 1);
    }
}
