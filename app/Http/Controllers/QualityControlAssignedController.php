<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;

use Auth;
use DB;
use Carbon\Carbon;

use App\QualityControlAssigned;
use App\Task;
use App\User;
use App\Rework;


use App\Notifications\QualityControlTaskStart;
use App\Notifications\NotifyDesignerForCompleteTask;
use App\Notifications\NotifyDesignerForTaskRework;
use App\Notifications\MarkAsComplete;
use App\Notifications\TaskRework;

use App\Events\PusherQualityControlTaskStart;
use App\Events\PusherNotifyDesignerForCompleteTask;
use App\Events\PusherNotifyDesignerForTaskRework;
use App\Events\PusherMarkAsComplete;
use App\Events\PusherTaskRework;

class QualityControlAssignedController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:quality_control,admin');
    }

    /**
     * Mark task as rework.
     *
     * @return \Illuminate\Http\Response
     */
    public function rework(Request $request)
    {
        if($request->has('batch'))
        {
            for ($i=0; $i < count($request->tasks); $i++) {
                DB::transaction(function() use ($request, $i){
                    $quality_control_assigned = QualityControlAssigned::where('id', $request->tasks[$i]['quality_control_assigned']['id'])->first();

                    if($quality_control_assigned->quality_control_id != $request->user()->id)
                    {
                        abort(403, 'Unauthorized action.');
                    }

                    $task = Task::where('id', $request->tasks[$i]['id'])->first();

                    $task->status = 'rework';

                    $task->save();

                    $quality_control_assigned->time_end = Carbon::now();

                    $quality_control_assigned->minutes_spent = Carbon::parse($quality_control_assigned->time_start)->diffInMinutes(Carbon::parse($quality_control_assigned->time_end));

                    $quality_control_assigned->save();

                    $rework = new Rework;

                    $rework->task_id = $task->id;

                    $rework->designer_id = $request->tasks[$i]['designer_assigned']['id'];

                    $rework->save();

                    $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

                    foreach ($users as $key => $user) {
                        // save the notifications to database - task, sender
                        $user->notify(new TaskRework($task, Auth::user()));
                        // broadcast the notifications - task, sender, recipient
                        event(new PusherTaskRework($task, Auth::user(), $user));
                    }

                    $designer = User::where('id', $request->tasks[$i]['designer_assigned']['id'])->first();

                    $designer->notify(new NotifyDesignerForTaskRework($task, Auth::user()));
                    event(new PusherNotifyDesignerForTaskRework($task, Auth::user(), $designer));
                });
            }
        }
        else{
            $this->validate($request, [
                'id' => 'required|numeric',
                'quality_control_assigned.id' => 'required|numeric',
                'designer_assigned.designer_id' => 'required|numeric',
            ]);

            DB::transaction(function() use ($request){
                $quality_control_assigned = QualityControlAssigned::where('id', $request->input('quality_control_assigned.id'))->first();
                    
                if($quality_control_assigned->quality_control_id != $request->user()->id)
                {
                    abort(403, 'Unauthorized action.');
                }

                $task = Task::where('id', $request->id)->first();

                $task->status = 'rework';

                $task->save();

                $quality_control_assigned->time_end = Carbon::now();

                $quality_control_assigned->minutes_spent = Carbon::parse($quality_control_assigned->time_start)->diffInMinutes(Carbon::parse($quality_control_assigned->time_end));

                $quality_control_assigned->save();

                $rework = new Rework;

                $rework->task_id = $task->id;

                $rework->designer_id = $request->input('designer_assigned.designer_id');

                $rework->save();

                $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

                foreach ($users as $key => $user) {
                    // save the notifications to database - task, sender
                    $user->notify(new TaskRework($task, Auth::user()));
                    // broadcast the notifications - task, sender, recipient
                    event(new PusherTaskRework($task, Auth::user(), $user));
                }

                $designer = User::where('id', $request->input('designer_assigned.designer_id'))->first();

                $designer->notify(new NotifyDesignerForTaskRework($task, Auth::user()));
                event(new PusherNotifyDesignerForTaskRework($task, Auth::user(), $designer));
            });
        }
    }

    /**
     * Mark a task as complete.
     *
     * @return \Illuminate\Http\Response
     */
    public function complete(Request $request)
    {
        if($request->has('batch'))
        {
            for ($i=0; $i < count($request->tasks); $i++) { 
                DB::transaction(function() use ($request, $i){
                    $quality_control_assigned = QualityControlAssigned::where('id', $request->tasks[$i]['quality_control_assigned']['id'])->first();

                    if($quality_control_assigned->quality_control_id != $request->user()->id)
                    {
                        abort(403, 'Unauthorized action.');
                    }

                    $task = Task::where('id', $request->tasks[$i]['id'])->first();

                    $task->status = 'complete';

                    $task->save();

                    $quality_control_assigned->time_end = Carbon::now();

                    $quality_control_assigned->minutes_spent = Carbon::parse($quality_control_assigned->time_start)->diffInMinutes(Carbon::parse($quality_control_assigned->time_end));

                    $quality_control_assigned->save();

                    $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

                    foreach ($users as $key => $user) {
                        // save the notifications to database - task, sender
                        $user->notify(new MarkAsComplete($task, Auth::user()));
                        // broadcast the notifications - task, sender, recipient
                        event(new PusherMarkAsComplete($task, Auth::user(), $user));
                    }

                    $designer = User::where('id', $request->tasks[$i]['designer_assigned']['designer_id'])->first();

                    $designer->notify(new NotifyDesignerForCompleteTask($task, Auth::user()));
                    event(new PusherNotifyDesignerForCompleteTask($task, Auth::user(), $designer));
                });
            }
        }
        else{
            $this->validate($request, [
                'id' => 'required|numeric',
                'quality_control_assigned.id' => 'required|numeric',
                'designer_assigned.designer_id' => 'required|numeric',
            ]);

            $quality_control_assigned = QualityControlAssigned::where('id', $request->input('quality_control_assigned.id'))->first();
            
            if($quality_control_assigned->quality_control_id != $request->user()->id)
            {
                abort(403, 'Unauthorized action.');
            }

            $task = Task::where('id', $request->id)->first();

            $task->status = 'complete';

            $task->save();

            $quality_control_assigned->time_end = Carbon::now();

            $quality_control_assigned->minutes_spent = Carbon::parse($quality_control_assigned->time_start)->diffInMinutes(Carbon::parse($quality_control_assigned->time_end));

            $quality_control_assigned->save();

            $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

            foreach ($users as $key => $user) {
                // save the notifications to database - task, sender
                $user->notify(new MarkAsComplete($task, Auth::user()));
                // broadcast the notifications - task, sender, recipient
                event(new PusherMarkAsComplete($task, Auth::user(), $user));
            }

            $designer = User::where('id', $request->input('designer_assigned.designer_id'))->first();

            $designer->notify(new NotifyDesignerForCompleteTask($task, Auth::user()));
            event(new PusherNotifyDesignerForCompleteTask($task, Auth::user(), $designer));
        }
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
        if($request->has('batch'))
        {
            for ($i=0; $i < count($request->tasks); $i++) { 
                DB::transaction(function() use ($request, $i){
                    $task = Task::where('id', $request->tasks[$i]['id'])->first();

                    $task->status = 'in_progress';

                    $task->save();

                    $quality_control_assigned = new QualityControlAssigned;

                    $quality_control_assigned->task_id = $task->id;

                    $quality_control_assigned->quality_control_id = $request->user()->id;

                    $quality_control_assigned->time_start = Carbon::now();

                    $quality_control_assigned->save();

                    $quality_control_assigned->task = $task;

                    $users = User::whereIn('role', ['admin'])->whereNotIn('id', [$request->user()->id])->get();

                    foreach ($users as $key => $user) {
                        // save the notifications to database - quality control assigned, sender
                        $user->notify(new QualityControlTaskStart($quality_control_assigned, Auth::user()));
                        // broadcast the notifications - quality control assigned, sender, recipient
                        event(new PusherQualityControlTaskStart($quality_control_assigned->task, Auth::user(), $user));
                    }
                });
            }
        }
        else{ 
            $this->validate($request, [
                'id' => 'required|numeric',
            ]);

            DB::transaction(function() use ($request){
                $task = Task::where('id', $request->id)->first();

                $task->status = 'in_progress';

                $task->save();

                $quality_control_assigned = new QualityControlAssigned;

                $quality_control_assigned->task_id = $task->id;

                $quality_control_assigned->quality_control_id = $request->user()->id;

                $quality_control_assigned->time_start = Carbon::now();

                $quality_control_assigned->save();

                $quality_control_assigned->task = $task;

                $users = User::whereIn('role', ['admin'])->whereNotIn('id', [$request->user()->id])->get();

                foreach ($users as $key => $user) {
                    // save the notifications to database - quality control assigned, sender
                    $user->notify(new QualityControlTaskStart($quality_control_assigned, Auth::user()));
                    // broadcast the notifications - quality control assigned, sender, recipient
                    event(new PusherQualityControlTaskStart($quality_control_assigned->task, Auth::user(), $user));
                }
            });

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
