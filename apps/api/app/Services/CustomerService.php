<?php

namespace App\Services;

use App\Models\BlacklistEntry;
use App\Models\BusinessRule;
use App\Models\Customer;
use App\Models\CustomerStat;
use App\Models\Reservation;

class CustomerService
{
    public function findOrCreate(array $data): Customer
    {
        $customer = Customer::query()->firstOrCreate(
            [
                'organization_id' => $data['organization_id'],
                'phone' => $data['phone'],
            ],
            [
                'name' => $data['name'],
                'email' => $data['email'] ?? null,
            ]
        );

        CustomerStat::query()->firstOrCreate([
            'customer_id' => $customer->id,
        ]);

        return $customer;
    }

    public function recordCompletedVisit(Reservation $reservation): void
    {
        $stats = CustomerStat::query()->firstOrCreate([
            'customer_id' => $reservation->customer_id,
        ]);

        $completed = $stats->completed_reservations + 1;
        $total = $stats->total_visits + 1;
        $avg = (($stats->average_party_size * $stats->completed_reservations) + $reservation->party_size) / max($completed, 1);

        $stats->update([
            'completed_reservations' => $completed,
            'total_visits' => $total,
            'last_visit_at' => now(),
            'average_party_size' => round($avg, 2),
            'favorite_table_id' => $reservation->table_id,
        ]);

        $this->maybePromoteVip($reservation);
    }

    public function recordNoShow(Reservation $reservation): void
    {
        $stats = CustomerStat::query()->firstOrCreate([
            'customer_id' => $reservation->customer_id,
        ]);

        $noShows = $stats->no_shows + 1;
        $stats->update(['no_shows' => $noShows]);

        $threshold = BusinessRule::query()
            ->where('branch_id', $reservation->branch_id)
            ->value('no_show_blacklist_threshold') ?? 3;

        if ($noShows >= $threshold) {
            $customer = $reservation->customer;
            $customer->update(['is_blacklisted' => true]);
            BlacklistEntry::query()->create([
                'organization_id' => $reservation->organization_id,
                'customer_id' => $customer->id,
                'reason' => "Automatic blacklist after {$noShows} no-shows",
                'status' => 'active',
            ]);
        }
    }

    private function maybePromoteVip(Reservation $reservation): void
    {
        $rules = BusinessRule::query()->where('branch_id', $reservation->branch_id)->first();
        $stats = CustomerStat::query()->where('customer_id', $reservation->customer_id)->first();

        if ($rules && $stats && $stats->total_visits >= $rules->vip_visit_threshold) {
            $reservation->customer?->update(['is_vip' => true]);
        }
    }
}
