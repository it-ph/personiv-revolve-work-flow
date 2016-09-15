<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Task;
use App\Category;
use App\Client;
use App\User;
use Carbon\Carbon;
use Auth;
use App\Notifications\TaskCreated;
use App\Events\PusherTaskCreated;
use App\Events\Test;

class TaskController extends Controller
{
    /**
     * Store multiple tasks.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function storeMultiple(Request $request)
    {
        for ($i=0; $i < count($request->all()); $i++) { 
            $this->validate($request, [
                $i.'.delivery_date' => 'required',
                $i.'.live_date' => 'required',
                $i.'.file_name' => 'required',
                $i.'.category' => 'required',
                $i.'.client' => 'required',
            ]);

            $category = Category::where('name', $request->input($i.'.category'))->first();

            if(!$category)
            {
                $category = new Category;
                $category->name = $request->input($i.'.category');
                $category->save();
            }

            $client = Client::where('name', $request->input($i.'.client'))->first();

            if(!$client)
            {
                $client = new Client;
                $client->name = $request->input($i.'.client');
                $client->save();
            }

            $task = new Task;

            $task->delivery_date = Carbon::parse($request->input($i.'.delivery_date'));
            $task->live_date = Carbon::parse($request->input($i.'.live_date'));
            $task->file_name = $request->input($i.'.file_name');
            $task->client_id = $client->id;
            $task->category_id = $category->id;
            $task->status = 'pending';
            // $task->spreadsheet_id = $request->input($i.'.spreadsheet_id');

            $task->save();
        }
    }

    /**
     * Checks the requests for duplicates and returns it back with a duplicate property.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function checkDuplicateMultiple(Request $request)
    {
        $tasks = array();

        for ($i=0; $i < count($request->all()); $i++) {
            $task = new Task;
            
            $task->file_name = $request->input($i.'.file_name');
            $task->delivery_date = $request->input($i.'.delivery_date');
            $task->live_date = $request->input($i.'.live_date');
            $task->category = $request->input($i.'.category');
            $task->client = $request->input($i.'.client');

            $task->duplicate = Task::where('file_name', $request->input($i.'.file_name'))->first() ? true : false;

            array_push($tasks, $task);
        }

        return $tasks;
    }

    /**
     * Checks if the task already exists.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $task = $request->id ? Task::whereNotIn('id', [$request->id])->where('file_name', $request->file_name)->first() : Task::where('file_name', $request->file_name)->first();

        return response()->json($task ? true : false);
    }

    /**
     * Enlist the request of user in a paginated form.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function paginate(Request $request)
    {
        if(!count($request->all()))
        {
            return;
        }

        $tasks = Task::query();

         // true if the user wants to include deleted records 
        if($request->withTrashed)
        {
            $tasks->withTrashed();
        }

        // iterates with clauses declared by user
        if(count($request->input('with')))
        {
            for ($i=0; $i < count($request->input('with')); $i++) {
                // if relation does not include deleted records
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $tasks->with($request->input('with')[$i]['relation']);
                }

                // if relation includes deleted records
                $tasks->with([$request->input('with')[$i]['relation'] => function($query){ $query->withTrashed(); }]); 
            }
        }

        // iterates where clauses declared by user
        if(count($request->input('where')))
        {
            for ($i=0; $i < count($request->input('where')); $i++) { 
                $tasks->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        if($request->searchText)
        {
            $tasks->where('file_name', 'like', '%'. $request->searchText .'%');
        }

        return $tasks->orderBy('created_at')->paginate($request->paginate);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $task = Task::find(1);

        $user->notify(new TaskCreated($task, $user));
        event(new PusherTaskCreated($task, $user, $user));
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
            'file_name' => 'required',
            'live_date' => 'required',
            'live_date' => 'required',
            'client_id' => 'required',
            'category_id' => 'required',
        ]);

        $duplicate = Task::where('file_name', $request->file_name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $task = new Task;

        $task->file_name = $request->file_name;
        $task->delivery_date = Carbon::parse($request->delivery_date);
        $task->live_date = Carbon::parse($request->live_date);
        $task->client_id = $request->client_id;
        $task->category_id = $request->category_id;
        $task->status = 'pending';

        $task->save();

        // fetch the users to be notified
        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new TaskCreated($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherTaskCreated($task, Auth::user(), $user));
        }

        return Task::with(['category' => function($query){ $query->withTrashed(); }])->with(['client' => function($query){ $query->withTrashed(); }])->where('id', $task->id)->first();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Task::withTrashed()->where('id', $id)->first();
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
