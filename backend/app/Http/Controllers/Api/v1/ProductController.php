<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductDetailResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        $this->middleware('throttle:60,1');
    }

    // List all active products with pagination
    /**
     * @OA\Get(
     *      path="/api/v1/products",
     *      operationId="getProductsList",
     *      tags={"Products"},
     *      summary="Get list of products",
     *      description="Returns list of products",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/ProductListResource")
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function index(Request $request)
    {
        $this->authorize('products.view', Product::class);

        $query = Product::with(['category', 'images'])->where('is_active', true);

        // Conditionally apply filters and search
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $query->when($request->query('category_id'), function ($query, $categoryId) {
            $query->where('category_id', $categoryId);
        });

        $query->when($request->has('featured'), function ($query) use ($request) {
            $query->where('featured', $request->boolean('featured'));
        });

        // Sorting
        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->query('per_page', 15);
        return ProductListResource::collection($query->paginate($perPage));
    }

    /**
     * Get all products for admin, with pagination and filters.
     */
    public function getAllProducts(Request $request)
    {
        $this->authorize('products.view-all', Product::class);

        $query = Product::with(['category', 'images']);

        // Conditionally apply filters and search
        $query->when($request->query('search'), function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        });

        $query->when($request->query('category_id'), function ($query, $categoryId) {
            $query->where('category_id', $categoryId);
        });

        $query->when($request->has('featured'), function ($query) use ($request) {
            $query->where('featured', $request->boolean('featured'));
        });
        
        $query->when($request->has('is_active'), function ($query) use ($request) {
            $query->where('is_active', $request->boolean('is_active'));
        });

        // Sorting
        $sortField = $request->query('sort', 'created_at');
        $sortDirection = $request->query('order', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->query('per_page', 15);
        return ProductListResource::collection($query->paginate($perPage));
    }

    // Get single product with all details
    public function show(Product $product)
    {
        return new ProductDetailResource($product->load(['category', 'images']));
    }

    // Create a new product
    public function store(Request $request)
    {
        $this->authorize('products.create', Product::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'base_currency' => 'required|string|size:3',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|max:255|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'tax_class_id' => 'nullable|exists:tax_classes,id',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = [];

        try {
            $product = DB::transaction(function () use ($validated, $request, &$imagePaths) {
                // Generate slug from name
                $validated['slug'] = Str::slug($validated['name']);

                // Handle featured flag
                $validated['featured'] = $request->boolean('featured', false);
                $validated['is_active'] = $request->boolean('is_active', true);

                // Create product
                $product = Product::create($validated);

                // Handle image uploads
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $key => $image) {
                        $path = $image->store('products', 'public');
                        $imagePaths[] = $path; // Store path for potential cleanup
                        $product->images()->create([
                            'image_path' => $path,
                            'is_primary' => $key === 0 // First image is primary
                        ]);
                    }
                }
                return $product;
            });

            return response()->json($product->load('images'), 201);

        } catch (\Throwable $e) {
            // Cleanup uploaded files if transaction fails
            foreach($imagePaths as $path) {
                Storage::disk('public')->delete($path);
            }
            
            // Re-throw the exception to be handled by Laravel's exception handler
            throw $e;
        }
    }

    // Update existing product
    public function update(Request $request, Product $product)
    {
        $this->authorize('products.update', $product);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'sku' => 'sometimes|required|string|max:255|unique:products,sku,' . $product->id,
            'category_id' => 'sometimes|required|exists:categories,id',
            'tax_class_id' => 'nullable|exists:tax_classes,id',
            'weight' => 'nullable|numeric|min:0',
            'length' => 'nullable|numeric|min:0',
            'width' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'featured' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'sometimes|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePaths = [];

        try {
            DB::transaction(function () use ($validated, $request, $product, &$imagePaths) {
                // Update slug if name changed
                if ($request->has('name')) {
                    $validated['slug'] = Str::slug($validated['name']);
                }

                $product->update($validated);

                // Handle new image uploads
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $image->store('products', 'public');
                        $imagePaths[] = $path; // Store path for potential cleanup
                        $product->images()->create([
                            'image_path' => $path
                        ]);
                    }
                    // Ensure a primary image exists if there wasn't one before
                    if ($product->images()->where('is_primary', true)->doesntExist()) {
                        $firstImage = $product->images()->first();
                        $firstImage?->update(['is_primary' => true]);
                    }
                }
            });

            return response()->json($product->fresh()->load('images'));

        } catch (\Throwable $e) {
            // Cleanup uploaded files if transaction fails
            foreach($imagePaths as $path) {
                Storage::disk('public')->delete($path);
            }
            
            // Re-throw the exception to be handled by Laravel's exception handler
            throw $e;
        }
    }

    // Delete a product
    public function destroy(Product $product)
    {
        $this->authorize('products.delete', $product);

        // Get image paths before deleting the product
        $imagePaths = $product->images()->pluck('image_path')->all();

        DB::transaction(function () use ($product) {
            // Deleting the product will cascade delete the image records from DB
            $product->delete();
        });

        // Delete associated images from storage after DB transaction is successful
        foreach ($imagePaths as $path) {
            Storage::disk('public')->delete($path);
        }

        return response()->json(null, 204);
    }

    // Set primary image
    public function setPrimaryImage(Product $product, ProductImage $image)
    {
        $this->authorize('products.manage-images', $product);
        // Verify the image belongs to the product
        if ($image->product_id !== $product->id) {
            return response()->json(['message' => 'Image does not belong to this product'], 422);
        }

        DB::transaction(function() use ($product, $image) {
            // Reset all primary flags
            $product->images()->update(['is_primary' => false]);

            // Set new primary
            $image->update(['is_primary' => true]);
        });

        return response()->json($image->fresh());
    }

    // Remove an image
    public function removeImage(Product $product, ProductImage $image)
    {
        $this->authorize('products.manage-images', $product);
        // Verify the image belongs to the product
        if ($image->product_id !== $product->id) {
            return response()->json(['message' => 'Image does not belong to this product'], 422);
        }

        // Don't allow removing the last image
        if ($product->images()->count() <= 1) {
            return response()->json(['message' => 'Cannot remove the last image'], 422);
        }

        $imagePath = $image->image_path;

        DB::transaction(function() use ($product, $image) {
            $wasPrimary = $image->is_primary;
            
            // Delete from database
            $image->delete();

            // If we deleted the primary image, set a new one
            if ($wasPrimary) {
                $newPrimary = $product->images()->first();
                if ($newPrimary) {
                    $newPrimary->update(['is_primary' => true]);
                }
            }
        });

        // Delete from storage after DB transaction is successful
        Storage::disk('public')->delete($imagePath);

        return response()->json(null, 204);
    }

    public function addImage(Request $request, Product $product)
    {
        // Check if the user is authorized to manage images for this product
        $this->authorize('products.manage-images', $product);

        // Validate request data
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_primary' => 'sometimes|boolean',
        ]);

        $path = null;

        try {
            DB::transaction(function () use ($request, $product, &$path) {

                // Store the uploaded image
                $path = $request->file('image')->store('products', 'public');

                $isPrimary = $request->boolean('is_primary', false);

                // If the new image is marked as primary,
                // reset all existing primary images for this product
                if ($isPrimary) {
                    $product->images()->update(['is_primary' => false]);
                }

                // Create the image record in the database
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $isPrimary,
                ]);
            });

            return response()->json([
                'message' => 'Image added successfully'
            ], 201);

        } catch (\Throwable $e) {

            // If the transaction fails, the database will be rolled back,
            // but the file system will not.
            // Therefore, we manually delete the uploaded file if it exists.
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            // Let Laravel's global exception handler handle the error
            throw $e;
        }
    }
}
