<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

abstract class BaseController extends Controller
{
    protected function branchId(): ?string
    {
        return request()->attributes->get('branch_id');
    }
}
