<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\SoftDeletes;

class QualityControlAssigned extends Model
{
    // use SoftDeletes;

    protected $table = 'quality_control_assigned';

    // protected $dates = ['deleted_at'];

    public function quality_control()
    {
    	return $this->belongsTo('App\User', 'quality_control_id');
    }

	public function task()
    {
    	return $this->belongsTo('App\Task');
    }
}
