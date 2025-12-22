<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('tree')) {
            $categories = Category::whereNull('parent_id')
                ->with('allChildren')
                ->get();
        } elseif ($request->boolean('parent_only')) {
            $categories = Category::whereNull('parent_id')->get();
        } else {
            $categories = Category::with(['parent', 'children'])->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category successfully created.',
            'data' => new CategoryResource($category->load(['parent', 'children']))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children', 'products']);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        // A category cannot be its own child - circular reference check.
        if ($request->has('parent_id')) {
            $parentId = $request->parent_id;
            
            // Prevent the category from becoming its own parent.
            if ($parentId == $category->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'A category cannot be its own parent.'
                ], 422);
            }

            // Prevent it from becoming the parent of one of its subcategories.
            $descendantIds = $category->getAllDescendantIds();
            if ($descendantIds->contains($parentId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'A category cannot be assigned to one of its own descendants.'
                ], 422);
            }
        }

        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Category successfully updated.',
            'data' => new CategoryResource($category->load(['parent', 'children']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Prevent deletion if there are already products in that category
        if ($category->products()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This category cannot be deleted as it contains products.'
            ], 422);
        }

        // Add this check for child categories
        if ($category->children()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This category cannot be deleted as it has sub-categories. Please delete them first.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category successfully deleted.'
        ]);
    }

    public function getChildren(Category $category): JsonResponse
    {
        $children = $category->children;

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($children)
        ]);
    }
    
    public function getDescendants(Category $category): JsonResponse
    {
        $descendants = $category->allChildren;

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($descendants)
        ]);
    }

    public function getBreadcrumb(Category $category): JsonResponse
    {
        $ancestors = $category->getAncestors();
        $breadcrumb = $ancestors->push($category);

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($breadcrumb)
        ]);
    }

    public function getParentCategories(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')->get();
        
        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }

    public function getTree(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')
            ->with('allChildren')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }
}
