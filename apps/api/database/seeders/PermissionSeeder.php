<?php

namespace Database\Seeders;

use App\Domain\Enums\Permission as PermissionEnum;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (PermissionEnum::cases() as $permission) {
            $group = Str::before($permission->value, '.');

            Permission::query()->updateOrCreate(
                ['slug' => $permission->value],
                [
                    'name' => Str::headline(str_replace('.', ' ', $permission->value)),
                    'group' => $group,
                ]
            );
        }
    }
}
