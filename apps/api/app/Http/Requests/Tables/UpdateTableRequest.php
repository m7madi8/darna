<?php

namespace App\Http\Requests\Tables;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTableRequest extends FormRequest
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
            'number' => ['sometimes', 'string', 'max:50'],
            'name' => ['nullable', 'string', 'max:120'],
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'min_capacity' => ['sometimes', 'integer', 'min:1'],
            'area_id' => ['nullable', 'uuid'],
            'is_vip' => ['boolean'],
            'is_combinable' => ['boolean'],
            'status' => ['sometimes', 'string'],
            'pos_x' => ['numeric'],
            'pos_y' => ['numeric'],
            'width' => ['numeric'],
            'height' => ['numeric'],
            'rotation' => ['numeric'],
            'shape' => ['nullable', 'string', 'in:rectangle,circle,square'],
        ];
    }
}
