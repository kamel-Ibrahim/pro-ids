<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('courses', function (Blueprint $table) {
        // Ensure these exist based on PDF spec 3.3
        if (!Schema::hasColumn('courses', 'short_description')) $table->string('short_description')->nullable();
        if (!Schema::hasColumn('courses', 'category')) $table->string('category')->nullable();
        if (!Schema::hasColumn('courses', 'difficulty')) $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
        if (!Schema::hasColumn('courses', 'estimated_duration')) $table->string('estimated_duration')->nullable();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
