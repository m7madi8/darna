<?php

namespace App\Events;

use App\Models\RestaurantTable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FloorUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public string $branchId) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('branch.'.$this->branchId.'.floor'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'floor.updated';
    }

    public function broadcastWith(): array
    {
        $tables = RestaurantTable::query()
            ->where('branch_id', $this->branchId)
            ->get(['id', 'number', 'status', 'capacity', 'pos_x', 'pos_y', 'width', 'height', 'is_vip', 'area_id']);

        return [
            'branch_id' => $this->branchId,
            'tables' => $tables,
            'updated_at' => now()->toIso8601String(),
        ];
    }
}
