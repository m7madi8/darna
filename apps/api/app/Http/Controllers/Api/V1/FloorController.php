<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\FloorUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Floor\UpdateFloorLayoutRequest;
use App\Http\Resources\TableResource;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FloorController extends Controller
{
    public function show(Request $request)
    {
        $branchId = $request->attributes->get('branch_id');

        $tables = RestaurantTable::query()
            ->where('branch_id', $branchId)
            ->with('area')
            ->orderBy('number')
            ->get();

        $active = Reservation::query()
            ->where('branch_id', $branchId)
            ->whereIn('status', ['pending', 'approved', 'checked_in'])
            ->where('ends_at', '>', now())
            ->get()
            ->keyBy('table_id');

        $tables->each(function (RestaurantTable $table) use ($active) {
            $reservation = $active->get($table->id);
            if ($reservation) {
                $table->setAttribute('ends_at', $reservation->ends_at);
                $table->setAttribute('reservation_id', $reservation->id);
            }
        });

        return response()->json([
            'data' => [
                'tables' => TableResource::collection($tables)->resolve(),
            ],
        ]);
    }

    public function updateLayout(UpdateFloorLayoutRequest $request)
    {
        $data = $request->validated();
        $branchId = $request->attributes->get('branch_id');

        DB::transaction(function () use ($data, $branchId) {
            foreach ($data['tables'] as $row) {
                RestaurantTable::query()
                    ->where('branch_id', $branchId)
                    ->whereKey($row['id'])
                    ->update(collect($row)->only(['pos_x', 'pos_y', 'width', 'height', 'rotation'])->filter(fn ($v) => $v !== null)->all());
            }
        });

        broadcast(new FloorUpdated($branchId))->toOthers();

        return $this->show($request);
    }
}
