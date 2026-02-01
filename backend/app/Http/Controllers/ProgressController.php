<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    /**
     * Get full progress for a course:
     * - Lesson completion
     * - Quiz history
     * - Overall percentage completed
     */
    public function courseProgress($courseId)
    {
        $user = Auth::guard('api')->user();

        $course = Course::with(['lessons', 'quiz'])->findOrFail($courseId);

        // ----- Lessons -----
        $totalLessons = $course->lessons()->count();

        $completedLessons = $course->lessons()
            ->whereHas('progress', function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->where('completed', true);
            })
            ->count();

        $lessonProgressPercent = $totalLessons > 0
            ? round(($completedLessons / $totalLessons) * 100, 2)
            : 0;

        // ----- Quizzes -----
        $quizAttempts = [];
        $quizPassed = false;

        if ($course->quiz) {
            $quizAttempts = QuizAttempt::where('quiz_id', $course->quiz->id)
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->get(['score', 'created_at']);

            $quizPassed = $quizAttempts->first()?->score >= $course->quiz->passing_score;
        }

        // ----- Overall progress -----
        $components = $totalLessons > 0 ? 1 : 0;
        $components += $course->quiz ? 1 : 0;

        $overallPercent = 0;

        if ($components > 0) {
            $overallPercent = (
                ($lessonProgressPercent > 0 ? 1 : 0) +
                ($quizPassed ? 1 : 0)
            ) / $components * 100;
        }

        return response()->json([
            'course_id' => $course->id,
            'lessons' => [
                'completed' => $completedLessons,
                'total' => $totalLessons,
                'percentage' => $lessonProgressPercent,
            ],
            'quiz' => [
                'exists' => (bool) $course->quiz,
                'passed' => $quizPassed,
                'attempts' => $quizAttempts,
            ],
            'overall_percentage' => round($overallPercent, 2),
        ]);
    }
}