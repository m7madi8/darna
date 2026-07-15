<?php



namespace Database\Seeders;



use App\Domain\Enums\TableAreaType;

use App\Domain\Enums\TableStatus;

use App\Models\Branch;

use App\Models\BusinessRule;

use App\Models\Organization;

use App\Models\RestaurantTable;

use App\Models\Role;

use App\Models\TableArea;

use App\Models\User;

use App\Models\WorkingHour;

use Carbon\Carbon;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Str;



class DemoSeeder extends Seeder

{

    public function run(): void

    {

        $organization = Organization::query()->updateOrCreate(

            ['slug' => 'darna'],

            [

                'name' => 'Darna',

                'timezone' => 'Africa/Cairo',

                'currency' => 'EGP',

                'settings' => null,

            ]

        );



        $branch = Branch::query()->updateOrCreate(

            [

                'organization_id' => $organization->id,

                'slug' => 'downtown',

            ],

            [

                'name' => 'Downtown',

                'phone' => '+201000000000',

                'email' => 'downtown@darna.test',

                'address' => '12 Tahrir Square, Cairo',

                'timezone' => 'Africa/Cairo',

                'is_active' => true,

                'settings' => null,

            ]

        );



        $indoor = TableArea::query()->updateOrCreate(

            ['branch_id' => $branch->id, 'name' => 'Main Hall'],

            [

                'type' => TableAreaType::Indoor,

                'color' => '#2F6B4F',

                'sort_order' => 1,

                'is_active' => true,

            ]

        );



        $terrace = TableArea::query()->updateOrCreate(

            ['branch_id' => $branch->id, 'name' => 'Terrace'],

            [

                'type' => TableAreaType::Terrace,

                'color' => '#C48A3A',

                'sort_order' => 2,

                'is_active' => true,

            ]

        );



        $vip = TableArea::query()->updateOrCreate(

            ['branch_id' => $branch->id, 'name' => 'VIP Lounge'],

            [

                'type' => TableAreaType::Vip,

                'color' => '#6B4C9A',

                'sort_order' => 3,

                'is_active' => true,

            ]

        );



        $layouts = [

            ['number' => '1', 'capacity' => 2, 'area' => $indoor, 'x' => 40, 'y' => 40],

            ['number' => '2', 'capacity' => 2, 'area' => $indoor, 'x' => 160, 'y' => 40],

            ['number' => '3', 'capacity' => 4, 'area' => $indoor, 'x' => 280, 'y' => 40],

            ['number' => '4', 'capacity' => 4, 'area' => $indoor, 'x' => 40, 'y' => 160],

            ['number' => '5', 'capacity' => 4, 'area' => $indoor, 'x' => 160, 'y' => 160],

            ['number' => '6', 'capacity' => 6, 'area' => $indoor, 'x' => 280, 'y' => 160],

            ['number' => '7', 'capacity' => 4, 'area' => $terrace, 'x' => 40, 'y' => 300],

            ['number' => '8', 'capacity' => 4, 'area' => $terrace, 'x' => 160, 'y' => 300],

            ['number' => '9', 'capacity' => 6, 'area' => $terrace, 'x' => 280, 'y' => 300],

            ['number' => '10', 'capacity' => 8, 'area' => $terrace, 'x' => 400, 'y' => 300],

            ['number' => '11', 'capacity' => 6, 'area' => $vip, 'x' => 40, 'y' => 440, 'vip' => true],

            ['number' => '12', 'capacity' => 8, 'area' => $vip, 'x' => 200, 'y' => 440, 'vip' => true],

        ];



        foreach ($layouts as $layout) {

            RestaurantTable::query()->updateOrCreate(

                [

                    'branch_id' => $branch->id,

                    'number' => $layout['number'],

                ],

                [

                    'area_id' => $layout['area']->id,

                    'name' => 'Table '.$layout['number'],

                    'capacity' => $layout['capacity'],

                    'min_capacity' => 1,

                    'status' => TableStatus::Available,

                    'is_vip' => (bool) ($layout['vip'] ?? false),

                    'is_combinable' => false,

                    'pos_x' => $layout['x'],

                    'pos_y' => $layout['y'],

                    'width' => 80,

                    'height' => 80,

                    'rotation' => 0,

                    'shape' => 'rectangle',

                ]

            );

        }



        for ($day = 0; $day <= 6; $day++) {

            WorkingHour::query()->updateOrCreate(

                [

                    'branch_id' => $branch->id,

                    'day_of_week' => $day,

                    'opens_at' => '12:00:00',

                ],

                [

                    'closes_at' => '02:00:00',

                    'is_closed' => false,

                ]

            );

        }



        BusinessRule::query()->updateOrCreate(

            ['branch_id' => $branch->id],

            [

                'max_duration_minutes' => 120,

                'min_duration_minutes' => 120,

                'min_party_size' => 1,

                'max_party_size' => 12,

                'slot_interval_minutes' => 15,

                'advance_booking_days' => 30,

                'no_show_blacklist_threshold' => 3,

                'vip_visit_threshold' => 10,

                'require_approval' => true,

                'maintenance_mode' => false,

            ]

        );



        $ownerRole = Role::query()->whereNull('organization_id')->where('slug', 'owner')->firstOrFail();

        $receptionRole = Role::query()->whereNull('organization_id')->where('slug', 'reception')->firstOrFail();



        $owner = User::query()->updateOrCreate(

            ['email' => 'owner@darna.test'],

            [

                'organization_id' => $organization->id,

                'name' => 'Darna Owner',

                'password' => Hash::make('password'),

                'phone' => '+201111111111',

                'is_active' => true,

                'email_verified_at' => Carbon::now(),

            ]

        );



        $reception = User::query()->updateOrCreate(

            ['email' => 'reception@darna.test'],

            [

                'organization_id' => $organization->id,

                'name' => 'Darna Reception',

                'password' => Hash::make('password'),

                'phone' => '+201222222222',

                'is_active' => true,

                'email_verified_at' => Carbon::now(),

            ]

        );



        $this->attachBranch($owner, $branch->id, true);

        $this->attachBranch($reception, $branch->id, true);



        $this->attachRole($owner, $ownerRole->id, $branch->id);

        $this->attachRole($reception, $receptionRole->id, $branch->id);

    }



    private function attachBranch(User $user, string $branchId, bool $primary = false): void

    {

        if ($user->branches()->where('branches.id', $branchId)->exists()) {

            $user->branches()->updateExistingPivot($branchId, ['is_primary' => $primary]);



            return;

        }



        $user->branches()->attach($branchId, [

            'id' => (string) Str::uuid(),

            'is_primary' => $primary,

        ]);

    }



    private function attachRole(User $user, string $roleId, string $branchId): void

    {

        $exists = $user->roles()

            ->where('roles.id', $roleId)

            ->wherePivot('branch_id', $branchId)

            ->exists();



        if ($exists) {

            return;

        }



        $user->roles()->attach($roleId, [

            'id' => (string) Str::uuid(),

            'branch_id' => $branchId,

        ]);

    }

}


