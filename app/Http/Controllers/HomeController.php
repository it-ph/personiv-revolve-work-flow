<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        return view('home')->with('user', $user);
    }

    /**
     * Redirects user to appropriate home page if authenticated.
     *
     * @return \Illuminate\Http\Response
     */
    public function home()
    {
        if (Auth::check()) {
            return redirect('/home');
        }
        return view('auth.login');
    }

    /**
     * Disable register routes.
     *
     * @return \Illuminate\Http\Response
     */
    public function disableRegister()
    {
        return redirect('/');
    }    
}
