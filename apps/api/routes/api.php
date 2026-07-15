<?php



use App\Http\Controllers\Api\V1\ActivityLogController;

use App\Http\Controllers\Api\V1\AnalyticsController;

use App\Http\Controllers\Api\V1\AuthController;

use App\Http\Controllers\Api\V1\BlacklistController;

use App\Http\Controllers\Api\V1\BranchController;

use App\Http\Controllers\Api\V1\CustomerController;

use App\Http\Controllers\Api\V1\DashboardController;

use App\Http\Controllers\Api\V1\EmployeeController;

use App\Http\Controllers\Api\V1\FloorController;

use App\Http\Controllers\Api\V1\HeatmapController;

use App\Http\Controllers\Api\V1\NotificationController;

use App\Http\Controllers\Api\V1\PublicBookingController;

use App\Http\Controllers\Api\V1\ReservationController;

use App\Http\Controllers\Api\V1\SettingsController;

use App\Http\Controllers\Api\V1\TableController;

use App\Http\Controllers\Api\V1\TimelineController;

use App\Http\Controllers\Api\V1\WaitingListController;

use Illuminate\Support\Facades\Route;



/*

|--------------------------------------------------------------------------

| API Routes

|--------------------------------------------------------------------------

|

| Prefixed with /api. Sanctum SPA cookie auth: GET /sanctum/csrf-cookie

| first, then authenticate via session cookies from the frontend origin.

| Staff routes require X-Branch-Id (enforced by EnsureBranchContext).

|

*/



Route::get('/health', function () {

    return response()->json([

        'status' => 'ok',

        'service' => 'darna-api',

        'timestamp' => now()->toIso8601String(),

    ]);

})->name('health');



Route::prefix('v1')->group(function () {

    Route::post('auth/login', [AuthController::class, 'login']);



    Route::prefix('public')->group(function () {

        Route::get('branches/{slug}', [PublicBookingController::class, 'showBranch']);

        Route::get('branches/{slug}/floor', [PublicBookingController::class, 'floor']);

        Route::get('branches/{slug}/availability', [PublicBookingController::class, 'availability']);

        Route::post('branches/{slug}/reservations', [PublicBookingController::class, 'storeReservation']);

        Route::post('branches/{slug}/waiting-list', [PublicBookingController::class, 'storeWaitingList']);

    });



    Route::middleware('auth:sanctum')->group(function () {

        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::get('auth/me', [AuthController::class, 'me']);



        Route::get('branches', [BranchController::class, 'index']);



        Route::middleware('branch')->group(function () {

            Route::get('dashboard', [DashboardController::class, 'summary'])

                ->middleware('permission:reservations.view');



            Route::get('reservations', [ReservationController::class, 'index'])

                ->middleware('permission:reservations.view');

            Route::post('reservations', [ReservationController::class, 'store'])

                ->middleware('permission:reservations.create');

            Route::get('reservations/{reservation}', [ReservationController::class, 'show'])

                ->middleware('permission:reservations.view');

            Route::patch('reservations/{reservation}', [ReservationController::class, 'update'])

                ->middleware('permission:reservations.update');

            Route::post('reservations/{reservation}/approve', [ReservationController::class, 'approve'])

                ->middleware('permission:reservations.approve');

            Route::post('reservations/{reservation}/reject', [ReservationController::class, 'reject'])

                ->middleware('permission:reservations.reject');

            Route::post('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])

                ->middleware('permission:reservations.cancel');

            Route::post('reservations/{reservation}/check-in', [ReservationController::class, 'checkIn'])

                ->middleware('permission:reservations.check_in');

            Route::post('reservations/{reservation}/check-out', [ReservationController::class, 'checkOut'])

                ->middleware('permission:reservations.check_out');

            Route::post('reservations/{reservation}/extend', [ReservationController::class, 'extend'])

                ->middleware('permission:reservations.extend');

            Route::post('reservations/{reservation}/move', [ReservationController::class, 'move'])

                ->middleware('permission:reservations.move');



            Route::get('tables', [TableController::class, 'index'])

                ->middleware('permission:tables.view');

            Route::post('tables', [TableController::class, 'store'])

                ->middleware('permission:tables.manage');

            Route::patch('tables/{table}', [TableController::class, 'update'])

                ->middleware('permission:tables.manage');

            Route::delete('tables/{table}', [TableController::class, 'destroy'])

                ->middleware('permission:tables.manage');



            Route::get('floor', [FloorController::class, 'show'])

                ->middleware('permission:floor.view');

            Route::put('floor/layout', [FloorController::class, 'updateLayout'])

                ->middleware('permission:tables.layout.update');



            Route::get('timeline', [TimelineController::class, 'show'])

                ->middleware('permission:timeline.view');



            Route::get('waiting-list', [WaitingListController::class, 'index'])

                ->middleware('permission:waiting_list.view');

            Route::post('waiting-list', [WaitingListController::class, 'store'])

                ->middleware('permission:waiting_list.manage');

            Route::post('waiting-list/{waitingList}/convert', [WaitingListController::class, 'convert'])

                ->middleware('permission:waiting_list.manage');



            Route::get('customers', [CustomerController::class, 'index'])

                ->middleware('permission:customers.view');

            Route::get('customers/{customer}', [CustomerController::class, 'show'])

                ->middleware('permission:customers.view');



            Route::get('employees', [EmployeeController::class, 'index'])

                ->middleware('permission:employees.view');

            Route::post('employees', [EmployeeController::class, 'store'])

                ->middleware('permission:employees.manage');

            Route::patch('employees/{user}', [EmployeeController::class, 'update'])

                ->middleware('permission:employees.manage');



            Route::get('settings', [SettingsController::class, 'show'])

                ->middleware('permission:settings.manage');

            Route::put('settings', [SettingsController::class, 'update'])

                ->middleware('permission:settings.manage');



            Route::get('analytics', [AnalyticsController::class, 'summary'])

                ->middleware('permission:analytics.view');



            Route::get('heatmap', [HeatmapController::class, 'show'])

                ->middleware('permission:heatmap.view');



            Route::get('activity-log', [ActivityLogController::class, 'index'])

                ->middleware('permission:activity_log.view');



            Route::get('notifications', [NotificationController::class, 'index'])

                ->middleware('permission:notifications.view');

            Route::post('notifications/{id}/read', [NotificationController::class, 'markRead'])

                ->middleware('permission:notifications.view');



            Route::get('blacklist', [BlacklistController::class, 'index'])

                ->middleware('permission:blacklist.manage');

        });

    });

});


