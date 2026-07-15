<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HeatmapController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'data' => [
                'hours' => [],
                'days' => [],
                'tables' => [],
                'areas' => [],
                'branch_id' => $request->attributes->get('branch_id'),
                'message' => 'Heat map module scaffolded.',
            ],
        ]);
    }
}
