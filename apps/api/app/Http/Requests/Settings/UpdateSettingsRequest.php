<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'max_duration_minutes' => ['sometimes', 'integer', 'min:30'],
            'min_duration_minutes' => ['sometimes', 'integer', 'min:15'],
            'min_party_size' => ['sometimes', 'integer', 'min:1'],
            'max_party_size' => ['sometimes', 'integer', 'min:1'],
            'slot_interval_minutes' => ['sometimes', 'integer', 'min:5'],
            'advance_booking_days' => ['sometimes', 'integer', 'min:1'],
            'require_approval' => ['sometimes', 'boolean'],
            'maintenance_mode' => ['sometimes', 'boolean'],
            'vip_visit_threshold' => ['sometimes', 'integer', 'min:1'],
            'no_show_blacklist_threshold' => ['sometimes', 'integer', 'min:1'],
        ];
    }
}
