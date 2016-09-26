<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Notification;
use Carbon\Carbon;
use Auth;

class NotificationController extends Controller
{
    /**
     * Paginate all notifications of authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate(Request $request)
    {
        return Notification::where('notifiable_id', $request->user()->id)->where('notifiable_type', 'App\\User')->orderBy('created_at', 'desc')->paginate($request->paginate);
    }


    /**
     * Mark all unread notifications as read.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAllAsRead(Request $request)
    {
        $notifications = Notification::where('notifiable_type', 'App\\User')->where('notifiable_id', Auth::user()->id)->whereNull('read_at')->get();

        foreach ($notifications as $notification) {
            $notification->read_at = Carbon::now();

            $notification->save();
        }

        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        return $user;
    }

    /**
     * Mark notification as read.
     *
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)->first();

        $notification->read_at = Carbon::now();

        $notification->save();

        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        return $user;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
