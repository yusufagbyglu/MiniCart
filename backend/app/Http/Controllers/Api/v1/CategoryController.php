<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Data\CategoryData;

/**
 * @group Category Management
 *
 * APIs for managing categories
 */
class CategoryController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Category::class, 'category');
    }

    /**
     * Display a listing of the categories.
     *
     * @authenticated
     * @queryParam per_page int Records per page. Default is 15. Example: 15
     * @response 200 {
     *   "data": [{"id": 1, "name": "Category 1", ...}],
     *   "current_page": 1,
     *   "per_page": 15,
     *   "total": 1,
     *   "success": true
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Category::class);

        $query = Category::with(['parent', 'children']);

        // Search by name or description
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        if ($request->has('per_page') && $request->query('per_page') != -1) {
            $categories = $query->paginate((int) $request->input('per_page', 15));
        } else {
            $categories = $query->get();
        }

        return CategoryResource::collection($categories)
            ->additional(['success' => true])
            ->toResponse($request);
    }

    /**
     * Store a newly created category in storage.
     *
     * @authenticated
     * @bodyParam name string required The name of the category. Example: Electronics
     * @bodyParam parent_id int The ID of the parent category. Example: 1
     * @response 201 {
     *   "success": true,
     *   "message": "Category successfully created.",
     *   "data": {"id": 1, "name": "Electronics", ...}
     * }
     */
    public function store(CategoryData $data): JsonResponse
    {
        $this->authorize('create', Category::class);

        $category = Category::create($data->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category successfully created.',
            'data' => new CategoryResource($category->load(['parent', 'children']))
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified category.
     *
     * @authenticated
     * @urlParam category int required The ID of the category. Example: 1
     * @response {
     *   "success": true,
     *   "data": {"id": 1, "name": "Electronics", ...}
     * }
     */
    public function show(Category $category): JsonResponse
    {
        $this->authorize('view', $category);

        $category->load(['parent', 'children', 'products']);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category)
        ]);
    }

    /**
     * Update the specified category in storage.
     *
     * @authenticated
     * @urlParam category int required The ID of the category. Example: 1
     * @bodyParam name string The name of the category. Example: New Category Name
     * @bodyParam parent_id int The ID of the new parent category. Example: 2
     * @response {
     *   "success": true,
     *   "message": "Category successfully updated.",
     *   "data": {"id": 1, "name": "New Category Name", ...}
     * }
     */
    public function update(CategoryData $data, Category $category): JsonResponse
    {
        $this->authorize('update', $category);

        // A category cannot be its own child - circular reference check.
        $parentId = $data->parent_id;
        if ($parentId) {

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

        $category->update($data->toArray());

        return response()->json([
            'success' => true,
            'message' => 'Category successfully updated.',
            'data' => new CategoryResource($category->load(['parent', 'children']))
        ]);
    }

    /**
     * Remove the specified category from storage.
     *
     * @authenticated
     * @urlParam category int required The ID of the category. Example: 1
     * @response {
     *   "success": true,
     *   "message": "Category successfully deleted."
     * }
     * @response 422 {
     *   "success": false,
     *   "message": "This category cannot be deleted as it contains products."
     * }
     */
    public function destroy(Category $category): JsonResponse
    {
        $this->authorize('delete', $category);

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

    /**
     * Get all direct children of a category.
     *
     * @authenticated
     * @urlParam category int required The ID of the parent category. Example: 1
     * @response {
     *   "success": true,
     *   "data": [{"id": 2, "name": "Subcategory 1", ...}]
     * }
     */
    public function getChildren(Category $category): JsonResponse
    {
        $this->authorize('view', $category);
        $children = $category->children;

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($children)
        ]);
    }

    /**
     * Get all descendants of a category (recursive).
     *
     * @authenticated
     * @urlParam category int required The ID of the parent category. Example: 1
     * @response {
     *   "success": true,
     *   "data": [
     *     {"id": 2, "name": "Child 1", ...},
     *     {"id": 3, "name": "Grandchild 1", ...}
     *   ]
     * }
     */
    public function getDescendants(Category $category): JsonResponse
    {
        $this->authorize('view', $category);
        $descendants = $category->allChildren;

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($descendants)
        ]);
    }

    /**
     * Get the breadcrumb trail for a category.
     *
     * @authenticated
     * @urlParam category int required The ID of the category. Example: 1
     * @response {
     *   "success": true,
     *   "data": [
     *     {"id": 1, "name": "Parent"},
     *     {"id": 2, "name": "Child"}
     *   ]
     * }
     */
    public function getBreadcrumb(Category $category): JsonResponse
    {
        $this->authorize('view', $category);
        $ancestors = $category->getAncestors();
        $breadcrumb = $ancestors->push($category);

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($breadcrumb)
        ]);
    }

    /**
     * Get all top-level (parent) categories.
     *
     * @authenticated
     * @response {
     *   "success": true,
     *   "data": [
     *     {"id": 1, "name": "Electronics", ...},
     *     {"id": 2, "name": "Clothing", ...}
     *   ]
     * }
     */
    public function getParentCategories(): JsonResponse
    {
        $this->authorize('viewAny', Category::class);
        $categories = Category::whereNull('parent_id')->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }

    /**
     * Get the complete category tree.
     *
     * @authenticated
     * @response {
     *   "success": true,
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Electronics",
     *       "children": [
     *         {"id": 2, "name": "Computers", ...}
     *       ]
     *     }
     *   ]
     * }
     */
    public function getTree(): JsonResponse
    {
        $this->authorize('viewAny', Category::class);
        $categories = Category::whereNull('parent_id')
            ->with('allChildren')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories)
        ]);
    }
}
