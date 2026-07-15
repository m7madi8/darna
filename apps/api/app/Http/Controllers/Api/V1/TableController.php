<?php



namespace App\Http\Controllers\Api\V1;



use App\Http\Controllers\Controller;

use App\Http\Requests\Tables\StoreTableRequest;

use App\Http\Requests\Tables\UpdateTableRequest;

use App\Http\Resources\TableResource;

use App\Models\RestaurantTable;

use Illuminate\Http\Request;



class TableController extends Controller

{

    public function index(Request $request)

    {

        $tables = RestaurantTable::query()

            ->where('branch_id', $request->attributes->get('branch_id'))

            ->with('area')

            ->orderBy('number')

            ->get();



        return TableResource::collection($tables);

    }



    public function store(StoreTableRequest $request)

    {

        $table = RestaurantTable::query()->create([

            ...$request->validated(),

            'branch_id' => $request->attributes->get('branch_id'),

            'status' => 'available',

        ]);



        return (new TableResource($table->load('area')))->response()->setStatusCode(201);

    }



    public function update(UpdateTableRequest $request, RestaurantTable $table)

    {

        abort_unless((string) $table->branch_id === (string) $request->attributes->get('branch_id'), 404);



        $table->update($request->validated());



        return new TableResource($table->fresh('area'));

    }



    public function destroy(Request $request, RestaurantTable $table)

    {

        abort_unless((string) $table->branch_id === (string) $request->attributes->get('branch_id'), 404);

        $table->delete();



        return response()->json(['message' => 'Deleted']);

    }

}


