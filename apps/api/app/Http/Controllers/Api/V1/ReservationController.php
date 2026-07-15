<?php



namespace App\Http\Controllers\Api\V1;



use App\Http\Controllers\Controller;

use App\Http\Requests\Reservations\ExtendReservationRequest;

use App\Http\Requests\Reservations\MoveReservationRequest;

use App\Http\Requests\Reservations\StoreReservationRequest;

use App\Http\Requests\Reservations\UpdateReservationRequest;

use App\Http\Resources\ReservationResource;

use App\Models\Reservation;

use App\Services\ReservationService;

use Illuminate\Http\Request;



class ReservationController extends Controller

{

    public function __construct(private readonly ReservationService $reservations) {}



    public function index(Request $request)

    {

        $branchId = $request->attributes->get('branch_id');



        $query = Reservation::query()

            ->where('branch_id', $branchId)

            ->with(['table', 'customer', 'area'])

            ->latest('starts_at');



        if ($status = $request->string('status')->toString()) {

            $query->where('status', $status);

        }



        if ($date = $request->string('date')->toString()) {

            $query->whereDate('starts_at', $date);

        }



        if ($q = $request->string('q')->toString()) {

            $query->where(function ($builder) use ($q) {

                $builder->where('guest_name', 'ilike', "%{$q}%")

                    ->orWhere('guest_phone', 'ilike', "%{$q}%")

                    ->orWhere('code', 'ilike', "%{$q}%")

                    ->orWhereHas('table', fn ($t) => $t->where('number', 'ilike', "%{$q}%"));

            });

        }



        return ReservationResource::collection($query->paginate(25));

    }



    public function store(StoreReservationRequest $request)

    {

        $branch = $request->attributes->get('branch');



        $reservation = $this->reservations->create([

            ...$request->validated(),

            'organization_id' => $branch->organization_id,

            'branch_id' => $branch->id,

        ], $request->user(), 'phone');



        return (new ReservationResource($reservation))->response()->setStatusCode(201);

    }



    public function show(Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource($reservation->load(['table', 'customer', 'area', 'statusHistories', 'extensions']));

    }



    public function update(UpdateReservationRequest $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);

        $reservation->update($request->validated());



        return new ReservationResource($reservation->fresh(['table', 'customer']));

    }



    public function approve(Request $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource($this->reservations->approve($reservation, $request->user()));

    }



    public function reject(Request $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);

        $reason = $request->string('reason')->toString() ?: null;



        return new ReservationResource($this->reservations->reject($reservation, $request->user(), $reason));

    }



    public function cancel(Request $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);

        $reason = $request->string('reason')->toString() ?: null;



        return new ReservationResource($this->reservations->cancel($reservation, $request->user(), $reason));

    }



    public function checkIn(Request $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource($this->reservations->checkIn($reservation, $request->user()));

    }



    public function checkOut(Request $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource($this->reservations->checkOut($reservation, $request->user()));

    }



    public function extend(ExtendReservationRequest $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource(

            $this->reservations->extend($reservation, $request->user(), (int) $request->validated('minutes'))

        );

    }



    public function move(MoveReservationRequest $request, Reservation $reservation)

    {

        $this->authorizeBranch($reservation);



        return new ReservationResource(

            $this->reservations->move($reservation, $request->user(), $request->validated('table_id'))

        );

    }



    private function authorizeBranch(Reservation $reservation): void

    {

        abort_unless(

            (string) $reservation->branch_id === (string) request()->attributes->get('branch_id'),

            404

        );

    }

}


