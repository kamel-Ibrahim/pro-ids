<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() {
    Schema::table('lessons', function (Blueprint $table) {
        if (!Schema::hasColumn('lessons', 'video_url')) $table->string('video_url')->nullable();
        if (!Schema::hasColumn('lessons', 'duration')) $table->string('duration')->nullable(); // e.g. "15 mins"
    });

    Schema::table('quizzes', function (Blueprint $table) {
        if (!Schema::hasColumn('quizzes', 'time_limit')) $table->integer('time_limit')->nullable(); // in minutes
        if (!Schema::hasColumn('quizzes', 'shuffle_questions')) $table->boolean('shuffle_questions')->default(false);
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
