<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use Notifiable;
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function designer_assigned()
    {
        return $this->hasMany('App\DesignerAssigned', 'designer_id');
    }

    public function quality_control_assigned()
    {
        return $this->hasMany('App\QualityControlAssigned', 'quality_control_id');
    }

    public function designer_rework()
    {
        return $this->hasMany('App\Rework', 'designer_id');
    }

    public function quality_control_rework()
    {
        return $this->hasMany('App\Rework', 'quality_control_id');
    }
}
