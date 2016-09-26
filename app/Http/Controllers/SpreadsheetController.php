<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Spreadsheet;
use App\Task;
use Carbon\Carbon;
use File;
use Storage;
use Excel;


class SpreadsheetController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:quality_control,admin');
    }

    public function download($start, $end)
    {
        $date_end = Carbon::parse($end)->addDay();

        $this->tasks = array();

        for ($date_start = Carbon::parse($start); $date_start->lt($date_end); $date_start->addDay()) { 
            $tasks = Task::whereBetween('created_at', [$date_start, $date_end])->get();

            $tasks->load(['client' => function($query){
                 $query->withTrashed();
            }]);

            $tasks->load(['category' => function($query){
                 $query->withTrashed();
            }]);

            $tasks->load(['designer_assigned' => function($query){
                $query->with(['designer' => function($query){
                    $query->withTrashed();
                }]);
            }]);

            $tasks->load(['quality_control_assigned' => function($query){
                $query->with(['quality_control' => function($query){
                    $query->withTrashed();
                }]);
            }]);

            $tasks->load(['reworks' => function($query){
                $query
                    ->with(['designer' => function($query){
                        $query->withTrashed();
                    }])
                    ->with(['quality_control' => function($query){
                        $query->withTrashed();
                    }])
                    ->orderBy('created_at', 'desc');
            }]);

            array_push($this->tasks, $tasks);
        }

        foreach ($this->tasks as $sheet) {
            foreach ($sheet as $task) {
                if(count($task->reworks))
                {
                    $task->rework = $task->reworks[0];
                }
            }
        }

        // return response()->json($this->tasks);

        Excel::create('Tracker from '. Carbon::parse($start)->toFormattedDateString() . ' to '. Carbon::parse($end)->toFormattedDateString(), function($excel) use ($start, $date_end){
            for ($date_start = Carbon::parse($start); $date_start->lt(Carbon::parse($date_end)); $date_start->addDay()) { 
                $excel->sheet($date_start->toFormattedDateString(), function($sheet){
                    foreach ($this->tasks as $task) {
                        $sheet->loadView('excel')
                            ->with('data', $task);
                    }
                });
            }
        })->download('xlsx');

    }
    /**
     * Paginate list of sheets.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate(Request $request)
    {
        $spreadsheets = Spreadsheet::query();

        if($request->searchText)
        {
            $spreadsheets->where('file_name', 'like', '%'. $request->searchText .'%');
        }

        return $spreadsheets->with('tasks')->where('filed', 1)->orderBy('created_at')->paginate(10);
    }

    /**
     * Read the contents of the file.
     *
     * @return \Illuminate\Http\Response
     */
    public function read($id)
    {
        $spreadsheet = Spreadsheet::where('id', $id)->first();

        $items = Excel::load(storage_path() .'/app'. $spreadsheet->path, function($reader){
            $reader->setDateFormat('Y-m-d');
        })->get();

        Storage::delete($spreadsheet->path);

        return $items;
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
        $spreadsheet = new Spreadsheet;

        $spreadsheet->file_name = str_random(10).'.xls';

        $spreadsheet->path = '/public/' . Carbon::now()->toDateString() . '/' . $spreadsheet->file_name;

        $spreadsheet->save();

        Storage::put($spreadsheet->path, file_get_contents($request->file('file')));

        return $spreadsheet;
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
