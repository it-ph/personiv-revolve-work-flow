<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

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

    public function designer_assigned()
    {
    	return $this->hasOne('App\DesignerAssigned');
    }

    public function quality_control_assigned()
    {
        return $this->hasOne('App\QualityControlAssigned');
    }

    public function reworks()
    {
        return $this->hasMany('App\Rework');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }
}
