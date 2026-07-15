<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function summary(Request $request)
    {
        $branchId = $request->attributes->get('branch_id');

        return response()->json([
            'data' => [
                'reservation_trends' => [],
                'peak_hours' => [],
                'table_utilization' => [],
                'most_popular_tables' => [],
                'most_loyal_customers' => [],
                'average_stay_minutes' => 90,
                'message' => 'Analytics engine scaffolded — connect reporting queries here.',
                'branch_id' => $branchId,
            ],
        ]);
    }
}
