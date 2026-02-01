<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'is_approved')) $table->boolean('is_approved')->default(true);
            if (!Schema::hasColumn('courses', 'short_description')) $table->text('short_description')->nullable();
            if (!Schema::hasColumn('courses', 'category')) $table->string('category')->nullable();
            if (!Schema::hasColumn('courses', 'difficulty')) $table->string('difficulty')->nullable();
            if (!Schema::hasColumn('courses', 'estimated_duration')) $table->string('estimated_duration')->nullable();
        });

        Schema::table('lessons', function (Blueprint $table) {
            if (!Schema::hasColumn('lessons', 'video_url')) $table->text('video_url')->nullable();
            if (!Schema::hasColumn('lessons', 'content')) $table->text('content')->nullable();
        });

        Schema::table('quizzes', function (Blueprint $table) {
            if (!Schema::hasColumn('quizzes', 'time_limit')) $table->integer('time_limit')->default(30);
        });
    }

    public function down(): void {}
};