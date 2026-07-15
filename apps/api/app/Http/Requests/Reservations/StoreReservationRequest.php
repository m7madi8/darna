<?php

namespace App\Http\Requests\Reservations;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'guest_name' => ['required', 'string', 'max:120'],
            'guest_phone' => ['required', 'string', 'max:40'],
            'email' => ['nullable', 'email'],
            'party_size' => ['required', 'integer', 'min:1', 'max:20'],
            'starts_at' => ['required', 'date'],
            'table_id' => ['nullable', 'uuid'],
            'preferred_table_id' => ['nullable', 'uuid'],
            'area_id' => ['nullable', 'uuid'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'internal_notes' => ['nullable', 'string', 'max:1000'],
            'duration_minutes' => ['nullable', 'integer', 'min:30', 'max:240'],
            'is_vip' => ['sometimes', 'boolean'],
        ];
    }
}
