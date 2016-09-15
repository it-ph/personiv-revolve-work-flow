<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Spreadsheet;
use Carbon\Carbon;
use File;
use Storage;
use Excel;


class SpreadsheetController extends Controller
{
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
