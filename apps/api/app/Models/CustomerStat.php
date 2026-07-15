<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerStat extends Model
{
    use HasFactory, HasUuids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'customer_id',
        'total_visits',
        'completed_reservations',
        'cancelled_reservations',
        'no_shows',
        'last_visit_at',
        'average_party_size',
        'favorite_table_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_visits' => 'integer',
            'completed_reservations' => 'integer',
            'cancelled_reservations' => 'integer',
            'no_shows' => 'integer',
            'last_visit_at' => 'datetime',
            'average_party_size' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function favoriteTable(): BelongsTo
    {
        return $this->belongsTo(RestaurantTable::class, 'favorite_table_id');
    }
}
