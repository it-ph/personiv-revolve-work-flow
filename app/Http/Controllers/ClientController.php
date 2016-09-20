<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Client;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:quality_control,admin')->except('index');
    }
    /**
     * Enlist the request of user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $clients = Client::query();

         // true if the category wants to include deleted records 
        if($request->withTrashed)
        {
            $clients->withTrashed();
        }

        // iterates where clauses declared by category
        if(count($request->input('where')))
        {
            for ($i=0; $i < count($request->input('where')); $i++) { 
                $clients->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        // matches any records with category request search text
        if($request->searchText)
        {
            $clients->where('name', 'like', '%'. $request->searchText .'%');
        }

        return $clients->get();
    }

    /**
     * Checks if the client already exists.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $client = $request->id ? Client::whereNotIn('id', [$request->id])->where('name', $request->name)->first() : Client::where('name', $request->name)->first();

        return response()->json($client ? true : false);
    }

    /**
     * Display a paginated listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate()
    {
        return Client::withTrashed()->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Client::all();
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
        $this->validate($request, [
            'name' => 'required',
        ]);

        $duplicate = Client::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $client = new Client;

        $client->name = $request->name;

        $client->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Client::withTrashed()->where('id', $id)->first();
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
        $this->validate($request, [
            'name' => 'required',
        ]);

        $duplicate = Client::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $client = Client::where('id', $id)->first();

        $client->name = $request->name;

        $client->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Client::where('id', $id)->delete();
    }
}
