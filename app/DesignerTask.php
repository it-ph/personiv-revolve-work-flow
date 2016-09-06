<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DesignerTask extends Model
{
    protected $table = 'designer_task';

    public function designer()
    {
    	return $this->belongsTo('App\User', 'designer_id');
    }

	public function task()
    {
    	return $this->belongsTo('App\Task');
    }    
}
