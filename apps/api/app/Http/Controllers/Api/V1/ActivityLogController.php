<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActivityLog::query()
            ->where('branch_id', $request->attributes->get('branch_id'))
            ->with('user:id,name,email')
            ->latest()
            ->paginate(50);

        return response()->json($logs);
    }
}
