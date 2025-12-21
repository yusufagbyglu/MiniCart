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

    /**
     * A category can have a parent category.
     * Example: The parent category of "Phones" could be "Electronics". *
     *
     * @return BelongsTo
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
    * A category can have more than one subcategory (children). 
    * Example: The children of the "Electronics" category are: "Phones", "Computers", etc. 
    * @return HasMany
    */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    /**
    * Recursively retrieve all subcategories (children at all levels).
    * This method returns all branches of the category tree. *
    * @return HasMany
    */
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }
    
    /**
    * Checks if the category has a subcategory.
    *
    * @return bool
    */
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    /**
    * Checks if the category is a parent category.
    * If parent_id is null, it is a parent category.
    *
    * @return bool
    */
    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }

    /**
    * Retrieves all parent categories (for breadcrumb) of the category. 
    * Example: "iPhone 15" -> "Phones" -> "Electronics"
    * @return \Illuminate\Support\Collection
    */
    public function getAncestors(){
        $ancestors = collect();
        $category = $this;

        while($category->parent){
            $ancestors->push($category->parent);
            $category = $category->parent;
        }

        return $ancestors->reverse();
    }

    /**
    * Products belonging to this category.
    *
    * @return HasMany
    */
    public function products(){
        return $this->hasMany(Product::class);
    }

    /**
    * Calculates the depth (level) of the category. * Main category: 0, below it: 1, further below: 2, etc.
    *
    * @return int
    */
    public function getDepth(): int{
        return $this->ancestors()->count();
    }

    /**
     * Returns the category path (breadcrumb) as a string. * Example: "Electronics > Phones > iPhone 15"
     *
     * @param string $separator
     * @return string
     */
    public function getPathAttribute(string $separator = '>'): string
    {
        $ancestors = $this->getAncestors();
        $path = $ancestors->pluck('name')->push($this->name);

        return $ancestors->pluck('name')->join($separator);
    }

}
