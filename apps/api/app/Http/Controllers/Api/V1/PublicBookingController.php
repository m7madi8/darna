<?php



namespace App\Http\Controllers\Api\V1;



use App\Http\Controllers\Controller;

use App\Http\Requests\PublicBooking\AvailabilityRequest;

use App\Http\Requests\Reservations\StoreReservationRequest;

use App\Http\Requests\WaitingList\StoreWaitingListRequest;

use App\Http\Resources\ReservationResource;

use App\Http\Resources\TableResource;

use App\Models\Branch;

use App\Models\Reservation;

use App\Models\RestaurantTable;

use App\Models\WaitingListEntry;

use App\Services\ReservationService;

use App\Services\SmartTableAssignmentService;

use Carbon\Carbon;



class PublicBookingController extends Controller

{

    public function __construct(

        private readonly ReservationService $reservations,

        private readonly SmartTableAssignmentService $assignment,

    ) {}



    public function showBranch(string $slug)

    {

        $branch = Branch::query()

            ->where('slug', $slug)

            ->where('is_active', true)

            ->with(['organization', 'areas', 'workingHours', 'businessRule'])

            ->firstOrFail();



        return response()->json([

            'data' => [

                'id' => $branch->id,

                'name' => $branch->name,

                'slug' => $branch->slug,

                'organization' => $branch->organization?->only(['id', 'name', 'slug']),

                'address' => $branch->address,

                'phone' => $branch->phone,

                'areas' => $branch->areas,

                'working_hours' => $branch->workingHours,

                'business_rules' => $branch->businessRule,

            ],

        ]);

    }



    public function floor(string $slug)

    {

        $branch = Branch::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();



        $tables = RestaurantTable::query()

            ->where('branch_id', $branch->id)

            ->with('area:id,name,type,color')

            ->get();



        $active = Reservation::query()

            ->where('branch_id', $branch->id)

            ->whereIn('status', ['pending', 'approved', 'checked_in'])

            ->where('ends_at', '>', now())

            ->get(['id', 'table_id', 'status', 'starts_at', 'ends_at', 'party_size']);



        return response()->json([

            'data' => [

                'tables' => TableResource::collection($tables),

                'reservations' => $active->map(fn ($r) => [

                    'id' => $r->id,

                    'table_id' => $r->table_id,

                    'status' => $r->status instanceof \BackedEnum ? $r->status->value : $r->status,

                    'starts_at' => $r->starts_at,

                    'ends_at' => $r->ends_at,

                    'party_size' => $r->party_size,

                ]),

            ],

        ]);

    }



    public function availability(AvailabilityRequest $request, string $slug)

    {

        $branch = Branch::query()->where('slug', $slug)->where('is_active', true)->with('businessRule')->firstOrFail();

        $data = $request->validated();



        $duration = $branch->businessRule?->max_duration_minutes ?? 120;

        $startsAt = Carbon::parse($data['date'].' '.$data['time'], $branch->timezone ?? 'UTC');

        $endsAt = $startsAt->copy()->addMinutes($duration);



        $recommended = $this->assignment->recommend(

            $branch->id,

            (int) $data['party_size'],

            $startsAt,

            $endsAt,

            $data['area_id'] ?? null,

            false

        );



        return response()->json([

            'data' => [

                'starts_at' => $startsAt->toIso8601String(),

                'ends_at' => $endsAt->toIso8601String(),

                'duration_minutes' => $duration,

                'recommended_tables' => TableResource::collection($recommended),

                'has_availability' => $recommended->isNotEmpty(),

                'suggest_waiting_list' => $recommended->isEmpty(),

            ],

        ]);

    }



    public function storeReservation(StoreReservationRequest $request, string $slug)

    {

        $branch = Branch::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();



        $reservation = $this->reservations->create([

            ...$request->validated(),

            'organization_id' => $branch->organization_id,

            'branch_id' => $branch->id,

        ], null, 'online');



        return (new ReservationResource($reservation))->response()->setStatusCode(201);

    }



    public function storeWaitingList(StoreWaitingListRequest $request, string $slug)

    {

        $branch = Branch::query()->where('slug', $slug)->where('is_active', true)->firstOrFail();



        $entry = WaitingListEntry::query()->create([

            ...$request->validated(),

            'branch_id' => $branch->id,

            'status' => 'waiting',

        ]);



        return response()->json(['data' => $entry], 201);

    }

}


