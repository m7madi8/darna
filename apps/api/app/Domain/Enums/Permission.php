<?php

namespace App\Domain\Enums;

enum Permission: string
{
    case ReservationsView = 'reservations.view';
    case ReservationsCreate = 'reservations.create';
    case ReservationsUpdate = 'reservations.update';
    case ReservationsApprove = 'reservations.approve';
    case ReservationsReject = 'reservations.reject';
    case ReservationsCancel = 'reservations.cancel';
    case ReservationsCheckIn = 'reservations.check_in';
    case ReservationsCheckOut = 'reservations.check_out';
    case ReservationsExtend = 'reservations.extend';
    case ReservationsMove = 'reservations.move';
    case TablesView = 'tables.view';
    case TablesManage = 'tables.manage';
    case TablesLayoutUpdate = 'tables.layout.update';
    case FloorView = 'floor.view';
    case TimelineView = 'timeline.view';
    case WaitingListView = 'waiting_list.view';
    case WaitingListManage = 'waiting_list.manage';
    case CustomersView = 'customers.view';
    case CustomersManage = 'customers.manage';
    case VipManage = 'vip.manage';
    case BlacklistManage = 'blacklist.manage';
    case EmployeesView = 'employees.view';
    case EmployeesManage = 'employees.manage';
    case RolesManage = 'roles.manage';
    case SettingsManage = 'settings.manage';
    case HoursManage = 'hours.manage';
    case BranchesManage = 'branches.manage';
    case AnalyticsView = 'analytics.view';
    case HeatmapView = 'heatmap.view';
    case ActivityLogView = 'activity_log.view';
    case NotificationsView = 'notifications.view';

    public static function allValues(): array
    {
        return array_column(self::cases(), 'value');
    }
}
