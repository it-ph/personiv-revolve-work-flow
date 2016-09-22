<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Auth;
use Carbon\Carbon;
use App\Rework;
use App\Task;
use App\User;

use App\Notifications\DesignerRevisionStart;
use App\Notifications\QualityControlTaskStart;
use App\Notifications\ForQC;
use App\Notifications\NotifyDesignerForCompleteTask;
use App\Notifications\MarkAsComplete;
use App\Notifications\DesignerTaskDecline;
use App\Notifications\TaskAssignedToDesigner;
use App\Notifications\NotifyDesignerForNewTask;
use App\Notifications\TaskRework;
use App\Notifications\NotifyDesignerForTaskRework;

use App\Events\PusherDesignerRevisionStart;
use App\Events\PusherForQC;
use App\Events\PusherQualityControlTaskStart;
use App\Events\PusherNotifyDesignerForCompleteTask;
use App\Events\PusherMarkAsComplete;
use App\Events\PusherDesignerTaskDecline;
use App\Events\PusherTaskAssignedToDesigner;
use App\Events\PusherNotifyDesignerForNewTask;
use App\Events\PusherTaskRework;
use App\Events\PusherNotifyDesignerForTaskRework;

class ReworkController extends Controller
{
    /**
     * Rework the task again.
     *
     * @return \Illuminate\Http\Response
     */
    public function rework(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $task = Task::where('id', $request->id)->first();

        $task->status = 'rework';

        $task->save();

        $previous = array_last($request->reworks, function($value){
            return $value;
        });

        $previous = Rework::where('id', $previous['id'])->first();

        $previous->quality_control_time_end = Carbon::now();

        $previous->quality_control_minutes_spent = Carbon::parse($previous->quality_control_time_start)->diffInMinutes(Carbon::parse($previous->quality_control_time_end));

        $previous->save();

        $rework = new Rework;

        $rework->task_id = $task->id;

        $rework->designer_id = $previous->designer_id;

        $rework->save();

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new TaskRework($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherTaskRework($task, Auth::user(), $user));
        }

        $designer = User::where('id', $rework->designer_id)->first();

        $designer->notify(new NotifyDesignerForTaskRework($task, Auth::user()));
        event(new PusherNotifyDesignerForTaskRework($task, Auth::user(), $designer));
    }

    /**
     * Pass the task to other people.
     *
     * @return \Illuminate\Http\Response
     */
    public function pass(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $rework = array_last($request->reworks, function($value){
            return $value;
        });

        $rework = Rework::where('id', $rework['id'])->first();

        $task = Task::where('id', $request->id)->first();

        $task->status = 'rework';

        $task->save();

        $rework->task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - designer assigned, sender
            $user->notify(new DesignerTaskDecline($rework, Auth::user()));
            // broadcast the notifications - designer assigned, sender, recipient
            event(new PusherDesignerTaskDecline($task, Auth::user(), $user));
        }

        $rework->delete();
    }

    /**
     * Mark a task as complete.
     *
     * @return \Illuminate\Http\Response
     */
    public function complete(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $rework = array_last($request->reworks, function($value){
            return $value;
        });

        $task = Task::where('id', $request->id)->first();

        $task->status = 'complete';

        $task->save();

        $rework = Rework::where('id', $rework['id'])->first();

        $rework->quality_control_time_end = Carbon::now();

        $rework->quality_control_minutes_spent = Carbon::parse($rework->quality_control_time_start)->diffInMinutes(Carbon::parse($rework->quality_control_time_end));

        $rework->save();

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new MarkAsComplete($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherMarkAsComplete($task, Auth::user(), $user));
        }

        $designer = User::where('id', $rework->designer_id)->first();

        $designer->notify(new NotifyDesignerForCompleteTask($task, Auth::user()));
        event(new PusherNotifyDesignerForCompleteTask($task, Auth::user(), $designer));
    }

    /**
     * Start QC revision.
     *
     * @return \Illuminate\Http\Response
     */
    public function startQC(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $rework = array_last($request->reworks, function($value){
            return $value;
        });

        $task = Task::where('id', $request->id)->first();

        $task->status = 'in_progress';

        $task->save();

        $rework = Rework::where('id', $rework['id'])->first();

        $rework->quality_control_id = $request->user()->id;
        
        $rework->quality_control_time_start = Carbon::now();
        
        $rework->save();

        $rework->task = $task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - quality control assigned, sender
            $user->notify(new QualityControlTaskStart($rework, Auth::user()));
            // broadcast the notifications - quality control assigned, sender, recipient
            event(new PusherQualityControlTaskStart($rework->task, Auth::user(), $user));
        }
    }

    /**
     * For QC revision.
     *
     * @return \Illuminate\Http\Response
     */
    public function forQC(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $rework = array_last($request->reworks, function($value){
            return $value;
        });

        $task = Task::where('id', $request->id)->first();

        $task->status = 'for_qc';

        $task->save();

        $rework = Rework::where('id', $rework['id'])->first();

        $rework->designer_time_end = Carbon::now();

        $rework->designer_minutes_spent = Carbon::parse($rework->designer_time_start)->diffInMinutes(Carbon::parse($rework->designer_time_end));
        
        $rework->save();

        $rework->task = $task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - task, sender
            $user->notify(new ForQC($task, Auth::user()));
            // broadcast the notifications - task, sender, recipient
            event(new PusherForQC($task, Auth::user(), $user));
        }
    }

    /**
     * Start revision.
     *
     * @return \Illuminate\Http\Response
     */
    public function revise(Request $request)
    {
        $this->validate($request, [
            'id' => 'required|numeric',
            'reworks' => 'required',
        ]);

        $rework = array_last($request->reworks, function($value){
            return $value;
        });

        $task = Task::where('id', $request->id)->first();

        $task->status = 'in_progress';

        $task->save();

        $rework = Rework::where('id', $rework['id'])->first();

        $rework->designer_time_start = Carbon::now();

        $rework->save();

        $rework->task = $task;

        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $key => $user) {
            // save the notifications to database - designer assigned, sender
            $user->notify(new DesignerRevisionStart($rework, Auth::user()));
            // broadcast the notifications - designer assigned, sender, recipient
            event(new PusherDesignerRevisionStart($rework->task, Auth::user(), $user));
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
        $this->validate($request, [
            'id' => 'required|numeric',
            'designer_id' => 'required|numeric',
        ]);

        $rework = new Rework;

        $rework->task_id = $request->id;
        $rework->designer_id = $request->designer_id;

        $rework->save();

        $rework->designer = User::where('id', $request->designer_id)->first();

        // Notify admin and quality control that a task was been assigned
        $users = User::whereIn('role', ['admin', 'quality_control'])->whereNotIn('id', [$request->user()->id])->get();

        foreach ($users as $user) {
            $user->notify(new TaskAssignedToDesigner($rework, $request->user()));
            event(new PusherTaskAssignedToDesigner($rework->designer, $request->user(), $user));
        }

        $user = User::where('id', $request->designer_id)->first();

        // Notify the designer for a new task
        $user->notify(new NotifyDesignerForNewTask($rework, $request->user()));
        event(new PusherNotifyDesignerForNewTask($rework->designer, $request->user(), $user));
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
