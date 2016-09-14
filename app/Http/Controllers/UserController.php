<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Auth;
use Hash;
use App\User;

class UserController extends Controller
{
    /**
     * Enlist the request of user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $users = User::query();

         // true if the user wants to include deleted records 
        if($request->withTrashed)
        {
            $users->withTrashed();
        }

        // iterates where clauses declared by user
        if(count($request->input('where')))
        {
            for ($i=0; $i < count($request->input('where')); $i++) { 
                $users->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        // matches any records with user request search text
        if($request->searchText)
        {
            $users->where('name', 'like', '%'. $request->searchText .'%')->orWhere('email', 'like', '%'. $request->searchText .'%');
        }

        return $users->get();
    }
    
    /**
     * Checks if the email is already taken.
     *
     * @return bool
     */
    public function checkEmail(Request $request)
    {
        $user = $request->id ? User::withTrashed()->whereNotIn('id', [$request->id])->where('email', $request->email)->first() : User::withTrashed()->where('email', $request->email)->first();

        return response()->json($user ? true : false);
    }

    /**
     * Resets the password to !welcome10.
     *
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        if(Auth::user()->role != 'admin')
        {
            abort(403, 'Unauthorized action.');
        }

        for ($i=0; $i < count($request->all()); $i++) { 
            $this->validate($request, [
                $i.'.id' => 'required|numeric',
            ]);

            $user = User::where('id', $request->input($i.'.id'))->first();

            $user->password = Hash::make('!welcome10');

            $user->save();
        }
    }

    /**
     * Changes the password of the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if($request->new == $request->confirm && $request->old != $request->new)
        {
            $user->password = Hash::make($request->new);
        }

        $user->save();
    }

    /**
     * Check if the password of the authenticated user is the same with his new password.
     *
     * @return bool
     */
    public function checkPassword(Request $request)
    {
        return response()->json(Hash::check($request->old, $request->user()->password));
    }

    /**
     * Logout the authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        Auth::logout();
    }

    /**
     * Returns authenticated user.
     *
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {   
        $user = Auth::user();

        $user->unread_notifications = $user->unreadNotifications;

        return $user;
    }

    /**
     * Returns a paginated list of users with a role of designer.
     *
     * @return \Illuminate\Http\Response
     */
    public function designersPaginate()
    {
        return User::withTrashed()->where('role', 'designer')->orderBy('name')->paginate(20);
    }

    /**
     * Returns a paginated dlist of users with a role of quality_control.
     *
     * @return \Illuminate\Http\Response
     */
    public function qualityControlPaginate()
    {
        return User::withTrashed()->where('role', 'quality_control')->orderBy('name')->paginate(20);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
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
        $check_user = User::withTrashed()->where('email', $request->email)->first();

        if($check_user)
        {
            return response()->json(true);
        }

        if($request->password != $request->confirm)
        {
            return response()->json(true);
        }
        
        $this->validate($request, [
            'name' => 'required|string',
            'role' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'confirm' => 'required|min:8',
        ]);

        $user = new User;

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        $user->password = Hash::make($request->password);

        $user->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::withTrashed()->where('id', $id)->first();
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
        $check_user = User::withTrashed()->whereNotIn('id', [$id])->where('email', $request->email)->first();

        if($check_user)
        {
            return response()->json(true);
        }
        
        $this->validate($request, [
            'name' => 'required|string',
            'role' => 'required|string',
            'email' => 'required|email',
        ]);

        $user = User::where('id', $id)->first();

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        $user->save();

        return $user;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if(Auth::user()->role != 'admin')
        {
            abort(403, 'Unauthorized action.');
        }

        User::where('id', $id)->delete();
    }
}
