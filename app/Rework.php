<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rework extends Model
{
    public function designer()
    {
    	return $this->belongsTo('App\User', 'designer_id');
    }

    public function quality_control()
    {
    	return $this->belongsTo('App\User', 'quality_control_id');
    }

    public function task()
    {
    	return $this->belongsTo('App\Task');
    }
}
