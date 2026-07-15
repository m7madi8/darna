<?php

namespace App\Services;

use App\Domain\Enums\ReservationStatus;
use App\Domain\Enums\TableStatus;
use App\Models\RestaurantTable;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class SmartTableAssignmentService
{
    public function __construct(
        private readonly ConflictDetectionService $conflicts
    ) {}

    /**
     * Recommend tables ordered by best fit (smallest capacity that fits party size).
     */
    public function recommend(
        string $branchId,
        int $partySize,
        Carbon $startsAt,
        Carbon $endsAt,
        ?string $preferredAreaId = null,
        bool $allowVip = false
    ): Collection {
        $tables = RestaurantTable::query()
            ->where('branch_id', $branchId)
            ->where('capacity', '>=', $partySize)
            ->where('min_capacity', '<=', $partySize)
            ->whereNotIn('status', [
                TableStatus::OutOfService->value,
                TableStatus::Cleaning->value,
            ])
            ->when(! $allowVip, fn ($q) => $q->where('is_vip', false))
            ->when($preferredAreaId, fn ($q) => $q->where('area_id', $preferredAreaId))
            ->orderBy('capacity')
            ->orderBy('number')
            ->with('area')
            ->get();

        return $tables
            ->filter(function (RestaurantTable $table) use ($startsAt, $endsAt) {
                if ($this->conflicts->isTableUnderMaintenance($table->id, $startsAt, $endsAt)) {
                    return false;
                }

                return ! $this->conflicts->hasOverlap($table->id, $startsAt, $endsAt);
            })
            ->values();
    }

    public function pickBest(...$args): ?RestaurantTable
    {
        return $this->recommend(...$args)->first();
    }

    public function deriveTableStatusForReservation(ReservationStatus $status, bool $isVip = false): TableStatus
    {
        return match ($status) {
            ReservationStatus::Pending => TableStatus::Pending,
            ReservationStatus::Approved => $isVip ? TableStatus::VipReserved : TableStatus::Reserved,
            ReservationStatus::CheckedIn => TableStatus::Occupied,
            default => TableStatus::Available,
        };
    }
}
