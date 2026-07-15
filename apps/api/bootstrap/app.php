<?php

use App\Http\Middleware\EnsureBranchContext;
use App\Http\Middleware\EnsurePermission;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        apiPrefix: 'api',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Enables Sanctum SPA cookie auth (CSRF + session) for stateful domains.
        $middleware->statefulApi();

        $middleware->alias([
            'branch' => EnsureBranchContext::class,
            'permission' => EnsurePermission::class,
            'EnsureBranchContext' => EnsureBranchContext::class,
            'EnsurePermission' => EnsurePermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
