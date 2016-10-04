<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Task;
use App\Category;
use App\Client;
use App\Spreadsheet;
use App\User;
use App\DesignerAssigned;
use Carbon\Carbon;
use Auth;
use DB;
use App\Notifications\TaskCreated;
use App\Notifications\TaskUpdated;
use App\Notifications\TaskDeleted;
use App\Notifications\SpreadsheetCreated;
use App\Events\PusherTaskCreated;
use App\Events\PusherTaskUpdated;
use App\Events\PusherTaskDeleted;
use App\Events\PusherSpreadsheetCreated;
use App\Events\Test;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:quality_control,admin')->except('enlist', 'paginate');
    }

    /**
     * Store multiple tasks.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function storeMultiple(Request $request)
    {
        $filedSheet = false;

        for ($i=0; $i < count($request->all()); $i++) { 
            $this->validate($request, [
                $i.'.delivery_date' => 'required',
                $i.'.live_date' => 'required',
                $i.'.file_name' => 'required',
                $i.'.category' => 'required',
                $i.'.client' => 'required',
                $i.'.spreadsheet_id' => 'required',
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
            $task->spreadsheet_id = $request->input($i.'.spreadsheet_id');

            $task->save();

            if(!$filedSheet){
                $spreadsheet = Spreadsheet::where('id', $request->input($i.'.spreadsheet_id'))->first();

                $spreadsheet->filed = true;

                $spreadsheet->save();

                $filedSheet = true;

                $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

                foreach ($users as $key => $user) {
                    // save the notifications to database - spreadsheet, sender
                    $user->notify(new SpreadsheetCreated($spreadsheet, Auth::user()));
                    // broadcast the notifications - spreadsheet, sender, recipient
                    event(new PusherSpreadsheetCreated($spreadsheet, Auth::user(), $user));
                }
            }
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

            if(!$request->input($i.'.delivery_date') && !$request->input($i.'.live_date') && !$request->input($i.'.file_name') && !$request->input($i.'.client') && !$request->input($i.'.category'))
            {
                continue;         
            }

            $task = new Task;
            
            $task->file_name = $request->input($i.'.file_name');
            $task->delivery_date = $request->input($i.'.delivery_date');
            $task->live_date = $request->input($i.'.live_date');
            $task->category = $request->input($i.'.category');
            $task->client = $request->input($i.'.client');
            $task->spreadsheet_id = $request->input($i.'.spreadsheet_id');

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
     * Enlist the request of user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
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
                // Manually created this because of looping issue
                if($request->input('with')[$i]['relation'] == 'designer_assigned')
                {
                    $tasks->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->with(['designer' => function($query){
                            $query->withTrashed();
                        }]);
                    }]);

                    continue;
                }
                else if($request->input('with')[$i]['relation'] == 'quality_control_assigned')
                {
                     $tasks->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->with(['quality_control' => function($query){
                            $query->withTrashed();
                        }]);
                    }]);

                    continue;
                }

                else if($request->input('with')[$i]['relation'] == 'reworks')
                {
                    $tasks->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->with(['designer' => function($query){
                            $query->withTrashed();
                        }])->with(['quality_control' => function($query){
                            $query->withTrashed();
                        }])->orderBy('created_at');
                    }]);

                    continue;
                }

                // Manually created this because of looping issue
                else if($request->input('with')[$i]['relation'] == 'comments')
                {
                    $tasks->with([$request->input('with')[$i]['relation'] => function($query){ 
                        $query->with(['user' => function($query){
                            $query->withTrashed();
                        }]);
                    }]);

                    continue;
                }

                // if relation does not include deleted records
                if(!$request->input('with')[$i]['withTrashed'])
                {
                    $tasks->with($request->input('with')[$i]['relation']);
                    
                }
                else{
                    // if relation includes deleted records
                    $tasks->with([$request->input('with')[$i]['relation'] => function($query){ $query->withTrashed(); }]); 
                }

            }
        }

        // iterates where clauses declared by user
        if(count($request->input('where')))
        {
            for ($i=0; $i < count($request->input('where')); $i++) { 
                $tasks->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        // iterates whereBetween clauses declared by user
        if($request->input('whereBetween'))
        {
            $tasks->whereBetween($request->input('whereBetween.label'), [Carbon::parse($request->input('whereBetween.start')), Carbon::parse($request->input('whereBetween.end'))]);
        }

        if($request->searchText)
        {
            $tasks->where('file_name', 'like', '%'. $request->searchText .'%');
        }

        if($request->paginate)
        {
            return $tasks->orderBy('created_at')->paginate($request->paginate);
        }

        return $tasks->first();
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
                    continue;
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

        DB::transaction(function() use ($request){
            $duplicate = Task::where('file_name', $request->file_name)->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            $task = new Task;

            $task->file_name = $request->file_name;
            $task->instructions = $request->instructions;
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
        });
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
        $this->validate($request, [
            'file_name' => 'required',
            'live_date' => 'required',
            'live_date' => 'required',
            'client_id' => 'required',
            'category_id' => 'required',
        ]);

        DB::transaction(function() use ($request, $id){
            $duplicate = Task::where('file_name', $request->file_name)->whereNotIn('id', [$id])->first();

            if($duplicate)
            {
                return response()->json(true);
            }

            $task = Task::where('id', $id)->first();

            $task->file_name = $request->file_name;
            $task->instructions = $request->instructions;
            $task->delivery_date = Carbon::parse($request->delivery_date);
            $task->live_date = Carbon::parse($request->live_date);
            $task->client_id = $request->client_id;
            $task->category_id = $request->category_id;
            
            $task->save();

            // fetch the users to be notified
            $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

            foreach ($users as $key => $user) {
                // save the notifications to database - task, sender
                $user->notify(new TaskUpdated($task, Auth::user()));
                // broadcast the notifications - task, sender, recipient
                event(new PusherTaskUpdated($task, Auth::user(), $user));
            }
        });
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::where('id', $id)->first();

        // fetch the users to be notified
        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [Auth::user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new TaskDeleted($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherTaskDeleted($task, Auth::user(), $user));
        }

        $task->delete();
    }
}
