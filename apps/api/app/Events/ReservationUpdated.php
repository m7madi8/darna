<?php

namespace App\Events;

use App\Models\Reservation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReservationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Reservation $reservation) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('branch.'.$this->reservation->branch_id.'.reservations'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'reservation.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->reservation->id,
            'code' => $this->reservation->code,
            'status' => $this->reservation->status instanceof \BackedEnum
                ? $this->reservation->status->value
                : $this->reservation->status,
            'table_id' => $this->reservation->table_id,
            'party_size' => $this->reservation->party_size,
            'starts_at' => optional($this->reservation->starts_at)->toIso8601String(),
            'ends_at' => optional($this->reservation->ends_at)->toIso8601String(),
            'guest_name' => $this->reservation->guest_name,
            'branch_id' => $this->reservation->branch_id,
        ];
    }
}
