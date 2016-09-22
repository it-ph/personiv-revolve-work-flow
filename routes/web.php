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

Route::get('/', 'HomeController@home');

Auth::routes();

/* Determines what type of user then returns the appropriate views*/
Route::get('/home', 'HomeController@index');


/* Route Resource */
Route::resource('category', 'CategoryController');
Route::resource('client', 'ClientController');
Route::resource('comment', 'CommentController');
Route::resource('designer-assigned', 'DesignerAssignedController');
Route::resource('designer-rework', 'DesignerReworkController');
Route::resource('notification', 'NotificationController');
Route::resource('quality-control-assigned', 'QualityControlAssignedController');
Route::resource('quality-control-rework', 'QualityControlReworkController');
Route::resource('rework', 'ReworkController');
Route::resource('spreadsheet', 'SpreadsheetController');
Route::resource('task', 'TaskController');
Route::resource('user', 'UserController');

/* User Routes */
Route::group(['prefix' => 'user'], function(){
	Route::post('check', 'UserController@check');
	Route::post('reset-password', 'UserController@resetPassword');
	Route::post('logout', 'UserController@logout');
	Route::post('check-email', 'UserController@checkEmail');
	Route::post('check-password', 'UserController@checkPassword');
	Route::post('change-password', 'UserController@changePassword');
	Route::post('designers/paginate', 'UserController@designersPaginate');
	Route::post('quality_control/paginate', 'UserController@qualityControlPaginate');
	Route::post('enlist', 'UserController@enlist');
	Route::post('pending', 'UserController@pending');
});

/* Category Routes */
Route::group(['prefix' => 'category'], function(){
	Route::post('paginate', 'CategoryController@paginate');
	Route::post('enlist', 'CategoryController@enlist');
	Route::post('check-duplicate', 'CategoryController@checkDuplicate');
});

/* Client Routes */
Route::group(['prefix' => 'client'], function(){
	Route::post('paginate', 'ClientController@paginate');
	Route::post('enlist', 'ClientController@enlist');
	Route::post('check-duplicate', 'ClientController@checkDuplicate');
});

/* Task Routes */
Route::group(['prefix' => 'task'], function(){
	Route::post('paginate', 'TaskController@paginate');
	Route::post('enlist', 'TaskController@enlist');
	Route::post('check-duplicate', 'TaskController@checkDuplicate');
	Route::post('store-multiple', 'TaskController@storeMultiple');
	Route::post('check-duplicate-multiple', 'TaskController@checkDuplicateMultiple');
});

/* Spreadsheet Routes */
Route::group(['prefix' => 'spreadsheet'], function(){
	Route::post('paginate', 'SpreadsheetController@paginate');
	Route::get('read/{spreadsheetID}', 'SpreadsheetController@read');
});

/* Designer Assigned Routes */
Route::group(['prefix' => 'designer-assigned'], function(){
	Route::post('paginate', 'DesignerAssignedController@paginate');
	Route::post('start', 'DesignerAssignedController@start');
	Route::post('decline', 'DesignerAssignedController@decline');
	Route::post('for-qc', 'DesignerAssignedController@forQC');
});

/* Quality Control Assigned Routes */
Route::group(['prefix' => 'quality-control-assigned'], function(){
	Route::post('complete', 'QualityControlAssignedController@complete');
	Route::post('rework', 'QualityControlAssignedController@rework');
});

/* Rework Routes */
Route::group(['prefix' => 'rework'], function(){
	Route::post('revise', 'ReworkController@revise');
	Route::post('for-qc', 'ReworkController@forQC');
	Route::post('start-qc', 'ReworkController@startQC');
	Route::post('complete', 'ReworkController@complete');
	Route::post('pass', 'ReworkController@pass');
	Route::post('rework', 'ReworkController@rework');
});


/* Notification Routes */
Route::group(['prefix' => 'notification'], function(){
	Route::post('mark-as-read/{notificationID}', 'NotificationController@markAsRead');
	Route::post('mark-all-as-read', 'NotificationController@markAllAsRead');
});

