<?php

namespace App\Http\Requests\WaitingList;

use Illuminate\Foundation\Http\FormRequest;

class StoreWaitingListRequest extends FormRequest
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
            'party_size' => ['required', 'integer', 'min:1'],
            'preferred_date' => ['required', 'date'],
            'preferred_time' => ['nullable', 'date_format:H:i'],
            'preferred_area_id' => ['nullable', 'uuid'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
