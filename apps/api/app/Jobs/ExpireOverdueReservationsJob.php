<?php

namespace App\Jobs;

use App\Domain\Enums\ReservationStatus;
use App\Services\ReservationService;
use App\Models\Reservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ExpireOverdueReservationsJob implements ShouldQueue
{
    use Queueable;

    public function handle(ReservationService $reservations): void
    {
        Reservation::query()
            ->where('status', ReservationStatus::Approved->value)
            ->where('starts_at', '<', now()->subMinutes(30))
            ->whereNull('checked_in_at')
            ->each(function (Reservation $reservation) use ($reservations) {
                $reservations->expire($reservation);
            });
    }
}
