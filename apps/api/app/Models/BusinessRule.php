<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessRule extends Model
{
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'branch_id',
        'max_duration_minutes',
        'min_duration_minutes',
        'min_party_size',
        'max_party_size',
        'slot_interval_minutes',
        'advance_booking_days',
        'no_show_blacklist_threshold',
        'vip_visit_threshold',
        'require_approval',
        'maintenance_mode',
        'meta',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'max_duration_minutes' => 'integer',
            'min_duration_minutes' => 'integer',
            'min_party_size' => 'integer',
            'max_party_size' => 'integer',
            'slot_interval_minutes' => 'integer',
            'advance_booking_days' => 'integer',
            'no_show_blacklist_threshold' => 'integer',
            'vip_visit_threshold' => 'integer',
            'require_approval' => 'boolean',
            'maintenance_mode' => 'boolean',
            'meta' => 'array',
        ];
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
