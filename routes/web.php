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
Route::resource('notification', 'NotificationController');
Route::resource('quality-control-assigned', 'QualityControlAssignedController');
Route::resource('quality-control-task', 'QualityControlTaskController');
Route::resource('rework', 'ReworkController');
Route::resource('spreadsheet', 'SpreadsheetController');
Route::resource('task', 'TaskController');
Route::resource('user', 'UserController');

/* User Routes */
Route::post('user-check', 'UserController@check');
Route::post('user-reset-password', 'UserController@resetPassword');
Route::post('user-logout', 'UserController@logout');
Route::post('user-check-email', 'UserController@checkEmail');
Route::post('user-check-password', 'UserController@checkPassword');
Route::post('user-change-password', 'UserController@changePassword');

/* Paginate */
Route::get('user-designers-paginate', 'UserController@designersPaginate');
Route::get('user-quality_control-paginate', 'UserController@qualityControlPaginate');
Route::get('category-paginate', 'CategoryController@paginate');
Route::get('client-paginate', 'ClientController@paginate');
Route::post('task-paginate', 'TaskController@paginate');
Route::post('spreadsheet-paginate', 'SpreadsheetController@paginate');
Route::post('designer-assigned-paginate', 'DesignerAssignedController@paginate');

/* Enlist */
Route::post('category-enlist', 'CategoryController@enlist');
Route::post('client-enlist', 'ClientController@enlist');
Route::post('user-enlist', 'UserController@enlist');
Route::post('task-enlist', 'TaskController@enlist');

/* Duplicate */
Route::post('category-check-duplicate', 'CategoryController@checkDuplicate');
Route::post('client-check-duplicate', 'ClientController@checkDuplicate');
Route::post('task-check-duplicate', 'TaskController@checkDuplicate');

/* Notification */
Route::get('notification-mark-as-read/{notificationID}', 'NotificationController@markAsRead');
Route::get('notification-mark-all-as-read', 'NotificationController@markAllAsRead');

/* Spreadsheet */
Route::get('spreadsheet-read/{spreadsheetID}', 'SpreadsheetController@read');

/* Task */
Route::post('task-store-multiple', 'TaskController@storeMultiple');
Route::post('task-check-duplicate-multiple', 'TaskController@checkDuplicateMultiple');
Route::post('task-started', 'TaskController@started');