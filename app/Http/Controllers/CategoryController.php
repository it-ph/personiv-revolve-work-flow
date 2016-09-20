<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Category;

class CategoryController extends Controller
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
        $categories = Category::query();

         // true if the category wants to include deleted records 
        if($request->withTrashed)
        {
            $categories->withTrashed();
        }

        // iterates where clauses declared by category
        if(count($request->input('where')))
        {
            for ($i=0; $i < count($request->input('where')); $i++) { 
                $categories->where($request->input('where')[$i]['label'], $request->input('where')[$i]['condition'], $request->input('where')[$i]['value']);
            }
        }

        // matches any records with category request search text
        if($request->searchText)
        {
            $categories->where('name', 'like', '%'. $request->searchText .'%');
        }

        return $categories->get();
    }

    /**
     * Checks if the category already exists.
     *
     * @return bool
     */
    public function checkDuplicate(Request $request)
    {
        $category = $request->id ? Category::whereNotIn('id', [$request->id])->where('name', $request->name)->first() : Category::where('name', $request->name)->first();

        return response()->json($category ? true : false);
    }
    /**
     * Display a paginated listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function paginate()
    {
        return Category::withTrashed()->orderBy('created_at', 'desc')->paginate(20);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Category::all();
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

        $duplicate = Category::where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $category = new Category;

        $category->name = $request->name;

        $category->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Category::withTrashed()->where('id', $id)->first();
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

        $duplicate = Category::whereNotIn('id', [$id])->where('name', $request->name)->first();

        if($duplicate)
        {
            return response()->json(true);
        }

        $category = Category::where('id', $id)->first();

        $category->name = $request->name;

        $category->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        Category::where('id', $id)->delete();
    }
}
