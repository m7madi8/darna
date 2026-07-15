<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $status = $this->status instanceof \BackedEnum ? $this->status->value : $this->status;

        return [
            'id' => $this->id,
            'number' => $this->number,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'min_capacity' => $this->min_capacity,
            'status' => $status,
            'status_color' => $this->status instanceof \App\Domain\Enums\TableStatus
                ? $this->status->color()
                : null,
            'is_vip' => $this->is_vip,
            'pos_x' => (float) $this->pos_x,
            'pos_y' => (float) $this->pos_y,
            'width' => (float) $this->width,
            'height' => (float) $this->height,
            'rotation' => (float) $this->rotation,
            'shape' => $this->shape,
            'area_id' => $this->area_id,
            'area' => $this->whenLoaded('area'),
            'branch_id' => $this->branch_id,
            'ends_at' => optional($this->ends_at)->toIso8601String(),
            'reservation_id' => $this->reservation_id ?? null,
        ];
    }
}
