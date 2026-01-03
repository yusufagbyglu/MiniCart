<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->foreignId('coupon_id')->nullable()->after('id')->constrained('coupons')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('carts', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropColumn('coupon_id');
        });
    }
};
