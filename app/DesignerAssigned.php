<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class DesignerAssigned extends Model
{
	// use SoftDeletes;

    protected $table = 'designer_assigned';

    // protected $dates = ['deleted_at'];

    public function designer()
    {
    	return $this->belongsTo('App\User', 'designer_id');
    }

	public function task()
    {
    	return $this->belongsTo('App\Task');
    }
}
