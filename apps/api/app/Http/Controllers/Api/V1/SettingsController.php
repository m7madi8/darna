<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Models\BusinessRule;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show(Request $request)
    {
        $rules = BusinessRule::query()
            ->where('branch_id', $request->attributes->get('branch_id'))
            ->first();

        return response()->json(['data' => $rules]);
    }

    public function update(UpdateSettingsRequest $request)
    {
        $rules = BusinessRule::query()->updateOrCreate(
            ['branch_id' => $request->attributes->get('branch_id')],
            $request->validated()
        );

        return response()->json(['data' => $rules]);
    }
}
