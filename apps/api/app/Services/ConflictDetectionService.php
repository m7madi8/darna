<?php

namespace App\Services;

use App\Domain\Enums\ReservationStatus;
use App\Domain\Enums\TableStatus;
use App\Models\BusinessRule;
use App\Models\Customer;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use App\Models\TableMaintenance;
use App\Models\WorkingHour;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class ConflictDetectionService
{
    public function hasOverlap(
        string $tableId,
        Carbon $startsAt,
        Carbon $endsAt,
        ?string $ignoreReservationId = null
    ): bool {
        return $this->overlappingReservations($tableId, $startsAt, $endsAt, $ignoreReservationId)->isNotEmpty();
    }

    public function overlappingReservations(
        string $tableId,
        Carbon $startsAt,
        Carbon $endsAt,
        ?string $ignoreReservationId = null
    ): Collection {
        return Reservation::query()
            ->where('table_id', $tableId)
            ->whereIn('status', [
                ReservationStatus::Approved->value,
                ReservationStatus::CheckedIn->value,
            ])
            ->when($ignoreReservationId, fn ($q) => $q->where('id', '!=', $ignoreReservationId))
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->get();
    }

    public function assertNoConflict(
        string $tableId,
        Carbon $startsAt,
        Carbon $endsAt,
        ?string $ignoreReservationId = null
    ): void {
        $conflicts = $this->overlappingReservations($tableId, $startsAt, $endsAt, $ignoreReservationId);

        if ($conflicts->isNotEmpty()) {
            $exception = ValidationException::withMessages([
                'table_id' => ['This table is already reserved for the selected time window.'],
            ]);
            $exception->status = 409;
            throw $exception;
        }
    }

    public function isTableUnderMaintenance(string $tableId, Carbon $startsAt, Carbon $endsAt): bool
    {
        return TableMaintenance::query()
            ->where('table_id', $tableId)
            ->where('is_active', true)
            ->where('starts_at', '<', $endsAt)
            ->where(function ($q) use ($startsAt) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>', $startsAt);
            })
            ->exists();
    }

    public function assertWithinWorkingHours(string $branchId, Carbon $startsAt, Carbon $endsAt): void
    {
        $day = (int) $startsAt->dayOfWeek;
        $hours = WorkingHour::query()
            ->where('branch_id', $branchId)
            ->where('day_of_week', $day)
            ->where('is_closed', false)
            ->get();

        if ($hours->isEmpty()) {
            throw ValidationException::withMessages([
                'starts_at' => ['The restaurant is closed on the selected day.'],
            ]);
        }

        $fits = $hours->contains(function (WorkingHour $slot) use ($startsAt, $endsAt) {
            $open = $startsAt->copy()->setTimeFromTimeString((string) $slot->opens_at);
            $close = $startsAt->copy()->setTimeFromTimeString((string) $slot->closes_at);

            // Overnight close (e.g. 12:00 → 01:00 next day) so a 2h seating can finish after midnight.
            if ((string) $slot->closes_at <= (string) $slot->opens_at) {
                $close->addDay();
            }

            return $startsAt->greaterThanOrEqualTo($open) && $endsAt->lessThanOrEqualTo($close);
        });

        if (! $fits) {
            throw ValidationException::withMessages([
                'starts_at' => ['Selected time is outside working hours.'],
            ]);
        }
    }

    public function assertBusinessRules(BusinessRule $rules, int $partySize, int $durationMinutes): void
    {
        if ($rules->maintenance_mode) {
            throw ValidationException::withMessages([
                'branch' => ['This branch is temporarily not accepting reservations.'],
            ]);
        }

        if ($partySize < $rules->min_party_size || $partySize > $rules->max_party_size) {
            throw ValidationException::withMessages([
                'party_size' => ["Party size must be between {$rules->min_party_size} and {$rules->max_party_size}."],
            ]);
        }

        if ($durationMinutes < $rules->min_duration_minutes || $durationMinutes > $rules->max_duration_minutes) {
            throw ValidationException::withMessages([
                'duration_minutes' => ["Duration must be between {$rules->min_duration_minutes} and {$rules->max_duration_minutes} minutes."],
            ]);
        }
    }

    public function assertTableAssignable(RestaurantTable $table, int $partySize, bool $allowVip = false): void
    {
        if (in_array($table->status, [TableStatus::OutOfService, TableStatus::Cleaning], true)) {
            throw ValidationException::withMessages([
                'table_id' => ['Selected table is not available.'],
            ]);
        }

        if ($table->is_vip && ! $allowVip) {
            throw ValidationException::withMessages([
                'table_id' => ['VIP tables require VIP eligibility.'],
            ]);
        }

        if ($partySize > $table->capacity || $partySize < $table->min_capacity) {
            throw ValidationException::withMessages([
                'table_id' => ['Party size does not fit the selected table capacity.'],
            ]);
        }
    }
}
