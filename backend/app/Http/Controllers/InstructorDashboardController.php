<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\QuizAttempt;

class InstructorDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::guard('api')->user();

        if (!$user || $user->role !== 'instructor') {
            return response()->json([
                'success' => false,
                'message' => 'Only instructors can access this dashboard'
            ], 403);
        }

        // Fixed: Use instructor_id column
        $courseIds = Course::where('instructor_id', $user->id)->pluck('id');

        $coursesCount = $courseIds->count();

        $studentsCount = Enrollment::whereIn('course_id', $courseIds)
            ->distinct('user_id')
            ->count('user_id');

        $averageScore = QuizAttempt::whereIn('quiz_id', function ($q) use ($courseIds) {
                $q->select('id')->from('quizzes')->whereIn('course_id', $courseIds);
            })
            ->selectRaw('MAX(score) as score')
            ->groupBy('quiz_id')
            ->get()
            ->avg('score');

        return response()->json([
            'success' => true,
            'data' => [
                'courses_created' => $coursesCount,
                'enrolled_students' => $studentsCount,
                'average_quiz_score' => round($averageScore ?? 0, 2),
            ]
        ]);
    }
}