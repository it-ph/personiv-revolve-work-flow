<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use Auth;
use DB;
use App\Comment;
use App\Task;
use App\User;
use App\Rework;

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
        if($request->has('batch'))
        {
            for ($i=0; $i < count($request->tasks); $i++) { 
                DB::transaction(function() use ($request, $i){
                    $task = Task::with(['designer_assigned' => function($query){ $query->with('designer'); }])->with(['quality_control_assigned' => function($query){ $query->with('quality_control'); }])->where('id', $request->tasks[$i]['id'])->first();

                    if($request->has('rework'))
                    {
                        $task->load('reworks');
                        
                        $rework = array_last($task->reworks->toArray(), function($value){
                            return $value;
                        });
                        
                        $rework = Rework::where('id', $rework['id'])->first();
                    }

                    $comment = new Comment;

                    $comment->task_id = $request->tasks[$i]['id'];
                    $comment->user_id = $request->user()->id;
                    $comment->message = $request->tasks[$i]['message'];
                    $comment->save();

                    if(!isset($rework))
                    { 
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
                    else{
                        // if the person is the designer do not notify
                        if(isset($rework->designer_id))
                        {
                            if($rework->designer_id != $request->user()->id)
                            {
                                $rework->designer = User::where('id', $rework->designer_id)->first();
                                $rework->designer->notify(new NotifyComment($task, Auth::user()));
                                event(new PusherNotifyComment($task, Auth::user(), $rework->designer));
                            }
                        }

                        if(isset($rework->quality_control_id))
                        {
                            if($rework->quality_control_id != $request->user()->id)
                            {
                                $rework->quality_control = User::where('id', $rework->quality_control_id)->first();
                                $rework->quality_control->notify(new NotifyComment($task, Auth::user()));
                                event(new PusherNotifyComment($task, Auth::user(), $rework->quality_control));
                            }
                        }
                    }
                });
            }
        }
        else{
            $this->validate($request, [
                'task_id' => 'required|numeric',
                'message' => 'required',
            ]);

            DB::transaction(function() use ($request){
                $task = Task::with(['designer_assigned' => function($query){ $query->with('designer'); }])->with(['quality_control_assigned' => function($query){ $query->with('quality_control'); }])->where('id', $request->task_id)->first();

                if($request->rework)
                {
                    $task->load('reworks');
                    
                    $rework = array_last($task->reworks->toArray(), function($value){
                        return $value;
                    });
                    
                    $rework = Rework::where('id', $rework['id'])->first();
                }

                $comment = new Comment;

                $comment->task_id = $request->task_id;
                $comment->user_id = $request->user()->id;
                $comment->message = $request->message;
                $comment->save();

                if(!isset($rework))
                { 
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
                else{
                    // if the person is the designer do not notify
                    if(isset($rework->designer_id))
                    {
                        if($rework->designer_id != $request->user()->id)
                        {
                            $rework->designer = User::where('id', $rework->designer_id)->first();
                            $rework->designer->notify(new NotifyComment($task, Auth::user()));
                            event(new PusherNotifyComment($task, Auth::user(), $rework->designer));
                        }
                    }

                    if(isset($rework->quality_control_id))
                    {
                        if($rework->quality_control_id != $request->user()->id)
                        {
                            $rework->quality_control = User::where('id', $rework->quality_control_id)->first();
                            $rework->quality_control->notify(new NotifyComment($task, Auth::user()));
                            event(new PusherNotifyComment($task, Auth::user(), $rework->quality_control));
                        }
                    }
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
