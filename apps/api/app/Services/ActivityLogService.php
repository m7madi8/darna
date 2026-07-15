<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    public function log(
        ?User $actor,
        string $action,
        ?Model $subject = null,
        ?array $old = null,
        ?array $new = null
    ): ActivityLog {
        return ActivityLog::query()->create([
            'organization_id' => $actor?->organization_id ?? ($subject->organization_id ?? null),
            'branch_id' => request()->attributes->get('branch_id')
                ?? ($subject->branch_id ?? null),
            'user_id' => $actor?->id,
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'old_values' => $old,
            'new_values' => $new,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
