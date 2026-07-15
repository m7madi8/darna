<?php

namespace App\Http\Requests\Floor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFloorLayoutRequest extends FormRequest
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
            'tables' => ['required', 'array', 'min:1'],
            'tables.*.id' => ['required', 'uuid'],
            'tables.*.pos_x' => ['required', 'numeric'],
            'tables.*.pos_y' => ['required', 'numeric'],
            'tables.*.width' => ['nullable', 'numeric'],
            'tables.*.height' => ['nullable', 'numeric'],
            'tables.*.rotation' => ['nullable', 'numeric'],
        ];
    }
}
