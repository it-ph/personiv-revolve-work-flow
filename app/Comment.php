<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    protected $dates = ['deleted_at'];

    public function task()
    {
    	return $this->belongsTo('App\Task');
    }

	public function user()
    {
    	return $this->belongsTo('App\User');
    }    
}
