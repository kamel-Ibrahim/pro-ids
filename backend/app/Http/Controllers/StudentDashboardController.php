<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;   // FIXED: Added missing import
use Illuminate\Support\Facades\Auth; // FIXED: Added missing import
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\QuizAttempt;

class StudentDashboardController extends Controller
{
    /**
     * Student dashboard summary (Spec 3.2)
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated'], 401);
        }

        if ($user->role !== 'student') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $enrolledCourses = Enrollment::where('user_id', $user->id)->count();

        $completedLessons = DB::table('lesson_progress') // FIXED: Now recognizes DB
            ->where('user_id', $user->id)
            ->where('completed', true)
            ->distinct('lesson_id')
            ->count('lesson_id');

        $averageScore = QuizAttempt::where('user_id', $user->id)
            ->selectRaw('MAX(score) as score')
            ->groupBy('quiz_id')
            ->get()
            ->avg('score');

        return response()->json([
            'success' => true,
            'data' => [
                'enrolled_courses' => $enrolledCourses,
                'completed_lessons' => $completedLessons,
                'average_quiz_score' => round($averageScore ?? 0, 2),
            ]
        ]);
    }
}