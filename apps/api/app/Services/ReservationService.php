<?php

namespace App\Services;

use App\Domain\Enums\ReservationStatus;
use App\Domain\Enums\TableStatus;
use App\Events\FloorUpdated;
use App\Events\ReservationUpdated;
use App\Models\ActivityLog;
use App\Models\BusinessRule;
use App\Models\Customer;
use App\Models\CustomerStat;
use App\Models\Reservation;
use App\Models\ReservationExtension;
use App\Models\ReservationStatusHistory;
use App\Models\RestaurantTable;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    public function __construct(
        private readonly ConflictDetectionService $conflicts,
        private readonly SmartTableAssignmentService $assignment,
        private readonly ActivityLogService $activity,
        private readonly CustomerService $customers,
        private readonly TableStatusService $tableStatus,
    ) {}

    public function create(array $data, ?User $actor = null, string $source = 'online'): Reservation
    {
        return DB::transaction(function () use ($data, $actor, $source) {
            $branchId = $data['branch_id'];
            $rules = BusinessRule::query()->where('branch_id', $branchId)->firstOrFail();
            $duration = (int) ($data['duration_minutes'] ?? $rules->max_duration_minutes);
            $startsAt = Carbon::parse($data['starts_at']);
            $endsAt = $startsAt->copy()->addMinutes($duration);
            $partySize = (int) $data['party_size'];

            $this->conflicts->assertBusinessRules($rules, $partySize, $duration);
            $this->conflicts->assertWithinWorkingHours($branchId, $startsAt, $endsAt);

            $customer = $this->customers->findOrCreate([
                'organization_id' => $data['organization_id'],
                'name' => $data['guest_name'],
                'phone' => $data['guest_phone'],
                'email' => $data['email'] ?? null,
            ]);

            if ($customer->is_blacklisted) {
                throw ValidationException::withMessages([
                    'guest_phone' => ['This customer requires manager approval before booking.'],
                ]);
            }

            $tableId = $data['table_id'] ?? $data['preferred_table_id'] ?? null;
            $allowVip = $customer->is_vip || ($data['is_vip'] ?? false);

            if (! $tableId) {
                $best = $this->assignment->pickBest(
                    $branchId,
                    $partySize,
                    $startsAt,
                    $endsAt,
                    $data['area_id'] ?? null,
                    $allowVip
                );

                if (! $best) {
                    throw ValidationException::withMessages([
                        'table_id' => ['No suitable table is available. Please join the waiting list.'],
                    ]);
                }

                $tableId = $best->id;
            }

            $table = RestaurantTable::query()->findOrFail($tableId);
            $this->conflicts->assertTableAssignable($table, $partySize, $allowVip);
            $this->conflicts->assertNoConflict($table->id, $startsAt, $endsAt);

            if ($this->conflicts->isTableUnderMaintenance($table->id, $startsAt, $endsAt)) {
                throw ValidationException::withMessages([
                    'table_id' => ['Selected table is under maintenance for this time.'],
                ]);
            }

            $status = $rules->require_approval
                ? ReservationStatus::Pending
                : ReservationStatus::Approved;

            $reservation = Reservation::query()->create([
                'code' => $this->generateCode(),
                'organization_id' => $data['organization_id'],
                'branch_id' => $branchId,
                'customer_id' => $customer->id,
                'table_id' => $table->id,
                'preferred_table_id' => $data['preferred_table_id'] ?? $table->id,
                'area_id' => $data['area_id'] ?? $table->area_id,
                'status' => $status,
                'party_size' => $partySize,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'duration_minutes' => $duration,
                'source' => $source,
                'notes' => $data['notes'] ?? null,
                'internal_notes' => $data['internal_notes'] ?? null,
                'guest_name' => $data['guest_name'],
                'guest_phone' => $data['guest_phone'],
                'is_vip' => $allowVip,
                'created_by' => $actor?->id,
                'approved_at' => $status === ReservationStatus::Approved ? now() : null,
                'approved_by' => $status === ReservationStatus::Approved ? $actor?->id : null,
            ]);

            $this->recordHistory($reservation, null, $status, $actor);
            $this->tableStatus->syncForReservation($reservation);
            $this->activity->log($actor, 'reservation.created', $reservation, null, $reservation->toArray());

            broadcast(new ReservationUpdated($reservation->fresh(['table', 'customer'])))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $reservation->fresh(['table', 'customer', 'area']);
        });
    }

    public function approve(Reservation $reservation, User $actor): Reservation
    {
        return DB::transaction(function () use ($reservation, $actor) {
            $this->assertTransition($reservation, ReservationStatus::Pending);

            $startsAt = Carbon::parse($reservation->starts_at);
            $endsAt = Carbon::parse($reservation->ends_at);

            if (! $reservation->table_id) {
                $best = $this->assignment->pickBest(
                    $reservation->branch_id,
                    $reservation->party_size,
                    $startsAt,
                    $endsAt,
                    $reservation->area_id,
                    $reservation->is_vip
                );

                if (! $best) {
                    throw ValidationException::withMessages([
                        'table_id' => ['Cannot approve: no suitable table available.'],
                    ]);
                }

                $reservation->table_id = $best->id;
            }

            $this->conflicts->assertNoConflict($reservation->table_id, $startsAt, $endsAt, $reservation->id);

            $from = $reservation->status;
            $reservation->update([
                'status' => ReservationStatus::Approved,
                'approved_at' => now(),
                'approved_by' => $actor->id,
            ]);

            $this->recordHistory($reservation, $from, ReservationStatus::Approved, $actor);
            $this->tableStatus->syncForReservation($reservation->fresh());
            $this->activity->log($actor, 'reservation.approved', $reservation);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    public function reject(Reservation $reservation, User $actor, ?string $reason = null): Reservation
    {
        return $this->transition($reservation, ReservationStatus::Rejected, $actor, [
            'rejection_reason' => $reason,
        ], 'reservation.rejected');
    }

    public function cancel(Reservation $reservation, User $actor, ?string $reason = null): Reservation
    {
        return $this->transition($reservation, ReservationStatus::Cancelled, $actor, [
            'cancellation_reason' => $reason,
        ], 'reservation.cancelled');
    }

    public function checkIn(Reservation $reservation, User $actor): Reservation
    {
        return DB::transaction(function () use ($reservation, $actor) {
            $this->assertTransition($reservation, ReservationStatus::Approved);

            $from = $reservation->status;
            $reservation->update([
                'status' => ReservationStatus::CheckedIn,
                'checked_in_at' => now(),
            ]);

            $this->recordHistory($reservation, $from, ReservationStatus::CheckedIn, $actor);
            $this->tableStatus->syncForReservation($reservation->fresh());
            $this->activity->log($actor, 'reservation.checked_in', $reservation);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    public function checkOut(Reservation $reservation, ?User $actor = null): Reservation
    {
        return DB::transaction(function () use ($reservation, $actor) {
            $this->assertTransition($reservation, ReservationStatus::CheckedIn);

            $from = $reservation->status;
            $reservation->update([
                'status' => ReservationStatus::Completed,
                'checked_out_at' => now(),
            ]);

            $this->recordHistory($reservation, $from, ReservationStatus::Completed, $actor);
            $this->customers->recordCompletedVisit($reservation);
            $this->tableStatus->releaseTable($reservation->table_id);
            $this->activity->log($actor, 'reservation.checked_out', $reservation);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    public function extend(Reservation $reservation, User $actor, int $minutes): Reservation
    {
        return DB::transaction(function () use ($reservation, $actor, $minutes) {
            if (! in_array($reservation->status, [ReservationStatus::Approved, ReservationStatus::CheckedIn], true)) {
                throw ValidationException::withMessages([
                    'status' => ['Only approved or occupied reservations can be extended.'],
                ]);
            }

            $previousEnds = Carbon::parse($reservation->ends_at);
            $newEnds = $previousEnds->copy()->addMinutes($minutes);

            $this->conflicts->assertNoConflict(
                $reservation->table_id,
                $previousEnds,
                $newEnds,
                $reservation->id
            );

            ReservationExtension::query()->create([
                'reservation_id' => $reservation->id,
                'minutes' => $minutes,
                'previous_ends_at' => $previousEnds,
                'new_ends_at' => $newEnds,
                'extended_by' => $actor->id,
            ]);

            $reservation->update([
                'ends_at' => $newEnds,
                'duration_minutes' => $reservation->duration_minutes + $minutes,
            ]);

            $this->activity->log($actor, 'reservation.extended', $reservation, [
                'ends_at' => $previousEnds->toIso8601String(),
            ], [
                'ends_at' => $newEnds->toIso8601String(),
                'minutes' => $minutes,
            ]);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    public function move(Reservation $reservation, User $actor, string $tableId): Reservation
    {
        return DB::transaction(function () use ($reservation, $actor, $tableId) {
            $table = RestaurantTable::query()->findOrFail($tableId);
            $startsAt = Carbon::parse($reservation->starts_at);
            $endsAt = Carbon::parse($reservation->ends_at);

            $this->conflicts->assertTableAssignable($table, $reservation->party_size, $reservation->is_vip);
            $this->conflicts->assertNoConflict($table->id, $startsAt, $endsAt, $reservation->id);

            $oldTableId = $reservation->table_id;
            $reservation->update(['table_id' => $table->id]);

            if ($oldTableId) {
                $this->tableStatus->releaseTable($oldTableId);
            }

            $this->tableStatus->syncForReservation($reservation->fresh());
            $this->activity->log($actor, 'reservation.moved', $reservation, [
                'table_id' => $oldTableId,
            ], [
                'table_id' => $table->id,
            ]);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    public function markNoShow(Reservation $reservation, User $actor): Reservation
    {
        $result = $this->transition($reservation, ReservationStatus::NoShow, $actor, [], 'reservation.no_show');
        $this->customers->recordNoShow($reservation);

        return $result;
    }

    public function expire(Reservation $reservation): Reservation
    {
        return $this->transition($reservation, ReservationStatus::Expired, null, [], 'reservation.expired');
    }

    private function transition(
        Reservation $reservation,
        ReservationStatus $to,
        ?User $actor,
        array $extra = [],
        string $action = 'reservation.updated'
    ): Reservation {
        return DB::transaction(function () use ($reservation, $to, $actor, $extra, $action) {
            $from = $reservation->status instanceof ReservationStatus
                ? $reservation->status
                : ReservationStatus::from($reservation->status);

            $reservation->update(array_merge(['status' => $to], $extra));
            $this->recordHistory($reservation, $from, $to, $actor);

            if ($to->isTerminal() && $reservation->table_id) {
                $this->tableStatus->releaseTable($reservation->table_id);
            } else {
                $this->tableStatus->syncForReservation($reservation->fresh());
            }

            $this->activity->log($actor, $action, $reservation);

            $fresh = $reservation->fresh(['table', 'customer']);
            broadcast(new ReservationUpdated($fresh))->toOthers();
            broadcast(new FloorUpdated($reservation->branch_id))->toOthers();

            return $fresh;
        });
    }

    private function assertTransition(Reservation $reservation, ReservationStatus $expected): void
    {
        $current = $reservation->status instanceof ReservationStatus
            ? $reservation->status
            : ReservationStatus::from($reservation->status);

        if ($current !== $expected) {
            throw ValidationException::withMessages([
                'status' => ["Reservation must be {$expected->value} to perform this action."],
            ]);
        }
    }

    private function recordHistory(
        Reservation $reservation,
        ReservationStatus|string|null $from,
        ReservationStatus $to,
        ?User $actor
    ): void {
        ReservationStatusHistory::query()->create([
            'reservation_id' => $reservation->id,
            'from_status' => $from instanceof ReservationStatus ? $from->value : $from,
            'to_status' => $to->value,
            'changed_by' => $actor?->id,
        ]);
    }

    private function generateCode(): string
    {
        do {
            $code = 'DRN-'.Str::upper(Str::random(8));
        } while (Reservation::query()->where('code', $code)->exists());

        return $code;
    }
}
