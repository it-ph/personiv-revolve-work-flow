<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DesignerAssigned;
use App\User;
use App\Task;
use Auth;
use Carbon\Carbon;
use App\Http\Requests;

use App\Notifications\TaskAssignedToDesigner;
use App\Notifications\NotifyDesignerForNewTask;
use App\Notifications\DesignerTaskStart;
use App\Notifications\DesignerTaskDecline;
use App\Notifications\ForQC;

use App\Events\PusherTaskAssignedToDesigner;
use App\Events\PusherNotifyDesignerForNewTask;
use App\Events\PusherDesignerTaskStart;
use App\Events\PusherDesignerTaskDecline;
use App\Events\PusherForQC;

class DesignerAssignedController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:quality_control,admin')->except('paginate', 'start', 'decline', 'forQC');

        $this->middleware('role:designer,designer')->only('start', 'decline', 'forQC');
    }
    
    /**
     * Change status of task to 'forQC'.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function forQC(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'designer_assigned.id' => 'required|numeric',
        ]);

        $task = Task::where('id', $request->id)->first();

        $task->status = 'for_qc';

        $task->save();

        $designer_assigned = DesignerAssigned::where('id', $request->input('designer_assigned.id'))->first();

        $designer_assigned->time_end = Carbon::now();

        $designer_assigned->minutes_spent = Carbon::parse($designer_assigned->time_start)->diffInMinutes(Carbon::parse($designer_assigned->time_end));

        $designer_assigned->save();

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new ForQC($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherForQC($task, Auth::user(), $user));
        }
    }

    /**
     * Task declined by designer.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function decline(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'designer_assigned.id' => 'required|numeric',
        ]);

        $task = Task::where('id', $request->id)->first();

        $designer_assigned = DesignerAssigned::where('id', $request->input('designer_assigned.id'))->first();

        $designer_assigned->task = $task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - designer assigned, sender
            $user->notify(new DesignerTaskDecline($designer_assigned, Auth::user()));
            // broadcast the notifications - designer assigned, sender, recipient
            event(new PusherDesignerTaskDecline($designer_assigned->task, Auth::user(), $user));
        }

        $designer_assigned->delete();
    }

    /**
     * Task start by a designer.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function start(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'designer_assigned.id' => 'required|numeric',
        ]);

        $task = Task::where('id', $request->id)->first();

        $task->status = 'in_progress';

        $task->save();

        $designer_assigned = DesignerAssigned::where('id', $request->input('designer_assigned.id'))->first();

        $designer_assigned->time_start = Carbon::now();

        $designer_assigned->save();

        $designer_assigned->task = $task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - designer assigned, sender
            $user->notify(new DesignerTaskStart($designer_assigned, Auth::user()));
            // broadcast the notifications - designer assigned, sender, recipient
            event(new PusherDesignerTaskStart($designer_assigned->task, Auth::user(), $user));
        }
    }

    /**
     * Display pending tasks of the designer.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate(Request $request)
    {
        if(!count($request->all()))
        {
            return;
        }

        $tasks = DesignerAssigned::query();

        $this->withTask = $request->input('withTask');
        $this->where = $request->input('where');
        $this->searchText = $request->input('searchText');

        $tasks->with(['task' => function($query){
            if(count($this->withTask))
            {
                for ($i=0; $i < count($this->withTask); $i++) {
                    // if relation does not include deleted records
                    if(!$this->withTask[$i]['withTrashed'])
                    {
                        $query->with($this->withTask[$i]['relation']);
                        continue;
                    }

                    // if relation includes deleted records
                    $query->with([$this->withTask[$i]['relation'] => function($query){ $query->withTrashed(); }]); 
                }

            }

            // iterates where clauses declared by user
            if(count($this->where))
            {
                for ($i=0; $i < count($this->where); $i++) { 
                    $query->where($this->where[$i]['label'], $this->where[$i]['condition'], $this->where[$i]['value']);
                }
            }

            if($this->searchText)
            {
                $query->where('file_name', 'like', '%'. $this->searchText .'%');
            }
        }]);

        return $tasks->where('designer_id', $request->user()->id)->orderBy('created_at')->paginate($request->paginate);

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
        for ($i=0; $i < count($request->all()); $i++) { 
            if($request->input($i.'.include'))
            { 
                $this->validate($request, [
                    $i.'.id' => 'required|numeric',
                    $i.'.designer_id' => 'required|numeric',
                ]);

                $designer_assigned = new DesignerAssigned;

                $designer_assigned->task_id = $request->input($i.'.id');
                $designer_assigned->designer_id = $request->input($i.'.designer_id');

                $designer_assigned->save();

                $designer_assigned->designer = User::where('id', $request->input($i.'.designer_id'))->first();

                // Notify admin and quality control that a task was been assigned
                $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

                foreach ($users as $user) {
                    $user->notify(new TaskAssignedToDesigner($designer_assigned, $request->user()));
                    event(new PusherTaskAssignedToDesigner($designer_assigned->designer, $request->user(), $user));
                }

                $user = User::where('id', $request->input($i.'.designer_id'))->first();

                // Notify the designer for a new task
                $user->notify(new NotifyDesignerForNewTask($designer_assigned, $request->user()));
                event(new PusherNotifyDesignerForNewTask($designer_assigned->designer, $request->user(), $user));
            }
        }
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
        $this->validate($request, [
            'designer_id' => 'required|numeric',
        ]);

        $previous = DesignerAssigned::with('designer')->where('task_id', $id)->first();

        if($previous->time_start)
        {
            abort(403, 'Task has already started.');
        }

        $designer_assigned = new DesignerAssigned;

        $designer_assigned->task_id = $id;

        $designer_assigned->designer_id = $request->designer_id;

        $designer_assigned->save();

        $designer_assigned->designer = User::where('id', $request->designer_id)->first();

        // Notify admin and quality control that a task was been assigned
        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $user) {
            $user->notify(new TaskAssignedToDesigner($designer_assigned, $request->user()));
            event(new PusherTaskAssignedToDesigner($designer_assigned->designer, $request->user(), $user));
        }

        $user = User::where('id', $request->designer_id)->first();

        // Notify the designer for a new task
        $user->notify(new NotifyDesignerForNewTask($designer_assigned, $request->user()));
        event(new PusherNotifyDesignerForNewTask($designer_assigned->designer, $request->user(), $user));

        $previous->delete();
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
