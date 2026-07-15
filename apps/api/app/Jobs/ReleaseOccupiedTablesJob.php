<?php

namespace App\Jobs;

use App\Domain\Enums\ReservationStatus;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ReleaseOccupiedTablesJob implements ShouldQueue
{
    use Queueable;

    public function handle(ReservationService $reservations): void
    {
        Reservation::query()
            ->where('status', ReservationStatus::CheckedIn->value)
            ->where('ends_at', '<', now())
            ->each(function (Reservation $reservation) use ($reservations) {
                $reservations->checkOut($reservation, null);
            });
    }
}
