<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stock_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->integer('change'); // e.g. -5 or +10
            $table->integer('current_stock'); // stock after change
            $table->enum('reason', ['sale', 'restock', 'adjustment', 'return', 'initial']);
            $table->string('reference_id')->nullable(); // e.g. Order ID or PO Number
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_histories');
    }
};
