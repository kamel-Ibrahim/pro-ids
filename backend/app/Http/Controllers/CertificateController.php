<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Certificate;
use App\Models\LessonCompletion;
use App\Models\QuizAttempt;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Student: Generate certificate
    |--------------------------------------------------------------------------
    */
    public function generate(Course $course)
    {
        abort_unless($course->published, 404);

        $userId = auth()->id();

        // 1️⃣ Check lessons
        $totalLessons = $course->lessons()->count();
        $completedLessons = LessonCompletion::where('user_id', $userId)
            ->whereIn('lesson_id', $course->lessons()->pluck('id'))
            ->count();

        abort_unless($totalLessons > 0 && $totalLessons === $completedLessons, 403);

        // 2️⃣ Check quizzes
        $avgScore = QuizAttempt::where('user_id', $userId)
            ->whereIn('quiz_id', $course->quizzes()->pluck('id'))
            ->avg('score');

        abort_unless($avgScore !== null && $avgScore >= 60, 403);

        // 3️⃣ Create or return certificate
        $certificate = Certificate::firstOrCreate(
            [
                'user_id' => $userId,
                'course_id' => $course->id,
            ],
            [
                'code' => strtoupper(Str::random(10)),
                'issued_at' => now(),
            ]
        );

        return response()->json([
            'certificate' => $certificate,
        ]);
    }
}