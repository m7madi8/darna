<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('branch.{branchId}.floor', function (User $user, string $branchId) {
    return $user->canAccessBranch($branchId);
});

Broadcast::channel('branch.{branchId}.reservations', function (User $user, string $branchId) {
    return $user->canAccessBranch($branchId);
});

Broadcast::channel('user.{userId}', function (User $user, string $userId) {
    return $user->id === $userId;
});
