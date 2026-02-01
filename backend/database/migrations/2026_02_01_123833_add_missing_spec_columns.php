<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Spec 2.2: Admin approval
            if (!Schema::hasColumn('courses', 'is_approved')) {
                $table->boolean('is_approved')->default(false);
            }
        });

        Schema::table('lessons', function (Blueprint $table) {
            // Spec 3.4: Attachments
            if (!Schema::hasColumn('lessons', 'attachment_path')) {
                $table->string('attachment_path')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('attachment_path');
        });
    }
};