<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'base_currency',
        'stock',
        'category_id',
        'is_active',
        'sku',
        'weight',
        'length',
        'width',
        'height',
        'featured',
        'sales_count'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'featured' => 'boolean',
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function images(){
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    // public function reviews(){
    //     return $this->hasMany()
    // }
}
