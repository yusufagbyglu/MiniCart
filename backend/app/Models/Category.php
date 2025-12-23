<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        $this->whenLoaded('children', fn () => $this->children()->exists());
        return $this->children()->exists();
    }

    /**
    * Recursively retrieve all parent categories for eager loading.
    * @return BelongsTo
    */
    public function parents(): BelongsTo
    {
        return $this->parent()->with('parents');
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
     * Scope a query to only include root-level categories.
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope a query to only include categories that have children.
     */
    public function scopeParents($query)
    {
        return $query->has('children');
    }

    /**
     * Scope a query to only include categories that do not have children (leaf nodes).
     */
    public function scopeLeaves($query)
    {
        return $query->doesntHave('children');
    }

    /**
    * Retrieves all parent categories (for breadcrumb) of the category. 
    * Example: "iPhone 15" -> "Phones" -> "Electronics"
    * @return \Illuminate\Support\Collection
    */
    public function getAncestors()
    {
        
     
        $ancestors = collect();
        $parent = $this->parents;
    
        // Traverse the pre-loaded parent relationships in memory
        // instead of querying the database in a loop.
        while ($parent) {
            $ancestors->prepend($parent);
            $parent = $parent->parents;
        }

        return $ancestors;
    }

    /**
    * Products belonging to this category.
    *
    * @return HasMany
    */
    public function products(): HasMany{
        return $this->hasMany(Product::class);
    }

    /**
     * Get all product from this category and all its descendants.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function allProducts()
    {
        $descendantIds = $this->getAllDescendantIds();
        return Product::whereIn('category_id', $descendantIds);
    }

    /**
     * Helper method to get all descendant category IDs including the current one.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllDescendantIds(): \Illuminate\Support\Collection
    {
        if (!$this->relationLoaded('allChildren')) {
            $this->load('allChildren');
        }

        $ids = collect([$this->id]);
        
        $collectIds = function ($categories) use (&$ids, &$collectIds) {
            foreach ($categories as $category) {
                $ids->push($category->id);
                if ($category->relationLoaded('allChildren')) {
                    $collectIds($category->allChildren);
                }
            }
        };

        $collectIds($this->allChildren);

        return $ids->unique();
    }

    /**
    * Calculates the depth (level) of the category. * Main category: 0, below it: 1, further below: 2, etc.
    *
    * @return int
    */
    public function getDepth(): int{
        return $this->getAncestors()->count();
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
    
        return $path->join(" {$separator} ");
    }

}
