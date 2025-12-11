<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'description',
        'parent_id',
    ];

    // Self-referential relationship for parent category
    public function parent(){
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Get all children categories
    public function children(){
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Products in this category
    public function products(){
        return $this->hasMany(Product::class);
    }
}
