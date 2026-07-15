<?php

namespace Database\Seeders;

use App\Domain\Enums\Permission as PermissionEnum;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $all = Permission::query()->pluck('id', 'slug');

        $matrix = [
            'owner' => [
                'name' => 'Owner',
                'description' => 'Full access to all restaurant features',
                'permissions' => PermissionEnum::allValues(),
            ],
            'manager' => [
                'name' => 'Manager',
                'description' => 'Manage operations, staff, and settings',
                'permissions' => array_values(array_filter(
                    PermissionEnum::allValues(),
                    fn (string $slug) => ! in_array($slug, ['branches.manage'], true)
                )),
            ],
            'supervisor' => [
                'name' => 'Supervisor',
                'description' => 'Oversee floor and reservations',
                'permissions' => [
                    PermissionEnum::ReservationsView->value,
                    PermissionEnum::ReservationsCreate->value,
                    PermissionEnum::ReservationsUpdate->value,
                    PermissionEnum::ReservationsApprove->value,
                    PermissionEnum::ReservationsReject->value,
                    PermissionEnum::ReservationsCancel->value,
                    PermissionEnum::ReservationsCheckIn->value,
                    PermissionEnum::ReservationsCheckOut->value,
                    PermissionEnum::ReservationsExtend->value,
                    PermissionEnum::ReservationsMove->value,
                    PermissionEnum::TablesView->value,
                    PermissionEnum::FloorView->value,
                    PermissionEnum::TimelineView->value,
                    PermissionEnum::WaitingListView->value,
                    PermissionEnum::WaitingListManage->value,
                    PermissionEnum::CustomersView->value,
                    PermissionEnum::CustomersManage->value,
                    PermissionEnum::AnalyticsView->value,
                    PermissionEnum::HeatmapView->value,
                    PermissionEnum::ActivityLogView->value,
                    PermissionEnum::NotificationsView->value,
                ],
            ],
            'reception' => [
                'name' => 'Reception',
                'description' => 'Front desk booking and guest handling',
                'permissions' => [
                    PermissionEnum::ReservationsView->value,
                    PermissionEnum::ReservationsCreate->value,
                    PermissionEnum::ReservationsUpdate->value,
                    PermissionEnum::ReservationsCancel->value,
                    PermissionEnum::ReservationsCheckIn->value,
                    PermissionEnum::ReservationsCheckOut->value,
                    PermissionEnum::ReservationsExtend->value,
                    PermissionEnum::ReservationsMove->value,
                    PermissionEnum::TablesView->value,
                    PermissionEnum::FloorView->value,
                    PermissionEnum::TimelineView->value,
                    PermissionEnum::WaitingListView->value,
                    PermissionEnum::WaitingListManage->value,
                    PermissionEnum::CustomersView->value,
                    PermissionEnum::NotificationsView->value,
                ],
            ],
            'host' => [
                'name' => 'Host',
                'description' => 'Seat guests and manage waiting list',
                'permissions' => [
                    PermissionEnum::ReservationsView->value,
                    PermissionEnum::ReservationsCheckIn->value,
                    PermissionEnum::ReservationsCheckOut->value,
                    PermissionEnum::ReservationsMove->value,
                    PermissionEnum::TablesView->value,
                    PermissionEnum::FloorView->value,
                    PermissionEnum::TimelineView->value,
                    PermissionEnum::WaitingListView->value,
                    PermissionEnum::WaitingListManage->value,
                    PermissionEnum::CustomersView->value,
                    PermissionEnum::NotificationsView->value,
                ],
            ],
            'cashier' => [
                'name' => 'Cashier',
                'description' => 'View reservations and complete check-outs',
                'permissions' => [
                    PermissionEnum::ReservationsView->value,
                    PermissionEnum::ReservationsCheckOut->value,
                    PermissionEnum::TablesView->value,
                    PermissionEnum::FloorView->value,
                    PermissionEnum::CustomersView->value,
                    PermissionEnum::NotificationsView->value,
                ],
            ],
            'readonly' => [
                'name' => 'Read Only',
                'description' => 'View-only access across modules',
                'permissions' => [
                    PermissionEnum::ReservationsView->value,
                    PermissionEnum::TablesView->value,
                    PermissionEnum::FloorView->value,
                    PermissionEnum::TimelineView->value,
                    PermissionEnum::WaitingListView->value,
                    PermissionEnum::CustomersView->value,
                    PermissionEnum::EmployeesView->value,
                    PermissionEnum::AnalyticsView->value,
                    PermissionEnum::HeatmapView->value,
                    PermissionEnum::ActivityLogView->value,
                    PermissionEnum::NotificationsView->value,
                ],
            ],
        ];

        foreach ($matrix as $slug => $config) {
                    PermissionEnum::ReservationsApprove->value,

                    PermissionEnum::ReservationsReject->value,

            $role = Role::query()->updateOrCreate(
                [
                    'organization_id' => null,
                    'slug' => $slug,
                ],
                [
                    'name' => $config['name'],
                    'description' => $config['description'],
                    'is_system' => true,
                ]
            );

            $permissionIds = collect($config['permissions'])
                ->map(fn (string $perm) => $all[$perm] ?? null)
                ->filter()
                ->values()
                ->all();

            $role->permissions()->sync($permissionIds);
        }
    }
}

