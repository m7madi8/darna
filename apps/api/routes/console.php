<?php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\ExpireOverdueReservationsJob;
use App\Jobs\ReleaseOccupiedTablesJob;

Schedule::job(new ExpireOverdueReservationsJob)->everyMinute();
Schedule::job(new ReleaseOccupiedTablesJob)->everyMinute();
