<?php

namespace App\Services;

use App\Domain\Enums\ReservationStatus;
use App\Domain\Enums\TableStatus;
use App\Models\Reservation;
use App\Models\RestaurantTable;

class TableStatusService
{
    public function __construct(
        private readonly SmartTableAssignmentService $assignment
    ) {}

    public function syncForReservation(Reservation $reservation): void
    {
        if (! $reservation->table_id) {
            return;
        }

        $status = $reservation->status instanceof ReservationStatus
            ? $reservation->status
            : ReservationStatus::from($reservation->status);

        $tableStatus = $this->assignment->deriveTableStatusForReservation($status, (bool) $reservation->is_vip);

        RestaurantTable::query()->whereKey($reservation->table_id)->update([
            'status' => $tableStatus,
        ]);
    }

    public function releaseTable(?string $tableId): void
    {
        if (! $tableId) {
            return;
        }

        $hasActive = Reservation::query()
            ->where('table_id', $tableId)
            ->whereIn('status', ['approved', 'checked_in', 'pending'])
            ->where('starts_at', '<=', now()->addMinutes(30))
            ->where('ends_at', '>', now())
            ->exists();

        if (! $hasActive) {
            RestaurantTable::query()->whereKey($tableId)->update([
                'status' => TableStatus::Available,
            ]);
        }
    }
}
