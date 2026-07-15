<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Darna API',
        'version' => 'v1',
        'status' => 'ok',
    ]);
});
