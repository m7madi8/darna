<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlacklistEntry;
use Illuminate\Http\Request;

class BlacklistController extends Controller
{
    public function index(Request $request)
    {
        $entries = BlacklistEntry::query()
            ->where('organization_id', $request->user()->organization_id)
            ->with('customer')
            ->latest()
            ->paginate(25);

        return response()->json($entries);
    }
}
