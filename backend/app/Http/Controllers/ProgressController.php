<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\LessonCompletion;
use App\Models\QuizAttempt;

class ProgressController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Student: Get course progress
    |--------------------------------------------------------------------------
    */
    public function courseProgress(Course $course)
    {
        abort_unless($course->published, 404);

        $userId = auth()->id();

        $totalLessons = $course->lessons()->count();
        $completedLessons = LessonCompletion::where('user_id', $userId)
            ->whereIn('lesson_id', $course->lessons()->pluck('id'))
            ->count();

        $quizAttempts = QuizAttempt::where('user_id', $userId)
            ->whereIn('quiz_id', $course->quizzes()->pluck('id'))
            ->get();

        $averageQuizScore = $quizAttempts->count()
            ? intval($quizAttempts->avg('score'))
            : 0;

        $lessonProgress = $totalLessons > 0
            ? intval(($completedLessons / $totalLessons) * 100)
            : 0;

        $overallProgress = intval(
            ($lessonProgress + $averageQuizScore) / 2
        );

        return response()->json([
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'lesson_progress' => $lessonProgress,
            'average_quiz_score' => $averageQuizScore,
            'overall_progress' => $overallProgress,
        ]);
    }
}