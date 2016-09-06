<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public function client()
    {
    	return $this->belongsTo('App\Client');
    }

    public function category()
    {
    	return $this->belongsTo('App\Category');
    }

    public function spreadsheet()
    {
    	return $this->belongsTo('App\Spreadsheet');
    }

    public function designer()
    {
    	return $this->belongsToMany('App\User', 'designer_id');
    }
}
