<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : $this->status,
            'party_size' => $this->party_size,
            'starts_at' => optional($this->starts_at)->toIso8601String(),
            'ends_at' => optional($this->ends_at)->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'source' => $this->source,
            'notes' => $this->notes,
            'internal_notes' => $this->when($request->user(), $this->internal_notes),
            'guest_name' => $this->guest_name,
            'guest_phone' => $this->when($request->user(), $this->guest_phone),
            'is_vip' => $this->is_vip,
            'table_id' => $this->table_id,
            'area_id' => $this->area_id,
            'branch_id' => $this->branch_id,
            'checked_in_at' => optional($this->checked_in_at)->toIso8601String(),
            'checked_out_at' => optional($this->checked_out_at)->toIso8601String(),
            'table' => new TableResource($this->whenLoaded('table')),
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'area' => $this->whenLoaded('area'),
            'status_histories' => $this->whenLoaded('statusHistories'),
            'extensions' => $this->whenLoaded('extensions'),
            'created_at' => optional($this->created_at)->toIso8601String(),
        ];
    }
}
