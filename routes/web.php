<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
	if (Auth::check()) {
		return redirect('/home');
    }
    return view('auth.login');
});

Auth::routes();

/* Determines what type of user then returns the appropriate views*/
Route::get('/home', 'HomeController@index');


/* Blocks register routes*/
Route::get('/register', function(){
	return redirect('/');
});

Route::post('/register', function(){
	return redirect('/');
});

/* Route Resource */
Route::resource('category', 'CategoryController');
Route::resource('client', 'ClientController');
Route::resource('comment', 'CommentController');
Route::resource('designer-assigned', 'DesignerAssignedController');
Route::resource('quality-control-assigned', 'QualityControlAssignedController');
Route::resource('quality-control-task', 'QualityControlTaskController');
Route::resource('rework', 'ReworkController');
Route::resource('spreadsheet', 'SpreadsheetController');
Route::resource('task', 'TaskController');
Route::resource('user', 'UserController');

/* User Routes */
Route::get('user-check', 'UserController@check');
Route::post('user-reset-password', 'UserController@resetPassword');
Route::post('user-logout', 'UserController@logout');
Route::post('user-check-email', 'UserController@checkEmail');
Route::post('user-check-password', 'UserController@checkPassword');
Route::post('user-change-password', 'UserController@changePassword');
Route::post('user-disable', 'UserController@disable');

/* Paginate */
Route::get('user-designers-paginate', 'UserController@designersPaginate');
Route::get('category-paginate', 'CategoryController@paginate');
Route::get('client-paginate', 'ClientController@paginate');