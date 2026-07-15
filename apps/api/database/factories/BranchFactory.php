<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Branch>
 */
class BranchFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->city().' Branch';

        return [
            'organization_id' => Organization::factory(),
            'name' => $name,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(4)),
            'phone' => fake()->optional()->e164PhoneNumber(),
            'email' => fake()->optional()->companyEmail(),
            'address' => fake()->address(),
            'timezone' => 'UTC',
            'is_active' => true,
            'settings' => null,
        ];
    }
}
