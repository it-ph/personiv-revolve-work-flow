<?php

namespace App\Http\Middleware;

use Closure;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $role, $admin)
    {
        if($request->user()->role != $role)
        {
            if($request->user()->role != $admin)
            {
                abort(403, 'Unauthorized action.');
            }
        }

        return $next($request);
    }
}
