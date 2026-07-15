<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'timezone' => $this->timezone,
            'is_active' => $this->is_active,
            'is_primary' => $this->when(isset($this->pivot), fn () => (bool) ($this->pivot->is_primary ?? false)),
            'organization' => $this->whenLoaded('organization'),
            'areas' => $this->whenLoaded('areas'),
            'working_hours' => $this->whenLoaded('workingHours'),
            'business_rules' => $this->whenLoaded('businessRule'),
        ];
    }
}
