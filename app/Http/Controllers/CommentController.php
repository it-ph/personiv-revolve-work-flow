<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use App\Comment;
use App\Task;

use App\Notifications\NotifyComment;
use App\Events\PusherNotifyComment;

class CommentController extends Controller
{
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
            'task_id' => 'required|numeric',
            'message' => 'required',
        ]);

        $task = Task::with(['designer_assigned' => function($query){ $query->with('designer'); }])->with(['quality_control_assigned' => function($query){ $query->with('quality_control'); }])->where('id', $request->task_id)->first();

        $comment = new Comment;

        $comment->task_id = $request->task_id;
        $comment->user_id = $request->user()->id;
        $comment->message = $request->message;
        $comment->save();

        if(isset($task->designer_assigned->designer))
        {
            // if the person is the designer do not notify
            if($task->designer_assigned->designer->id != $request->user()->id)
            {
                $task->designer_assigned->designer->notify(new NotifyComment($task, Auth::user()));
                event(new PusherNotifyComment($task, Auth::user(), $task->designer_assigned->designer));
            }
        }
        
        if(isset($task->quality_control_assigned->quality_control))
        {
            // if the person is the quality control do not notify
            if($task->quality_control_assigned->quality_control->id != $request->user()->id)
            {
                $task->quality_control_assigned->quality_control->notify(new NotifyComment($task, Auth::user()));
                event(new PusherNotifyComment($task, Auth::user(), $task->quality_control_assigned->quality_control));
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
