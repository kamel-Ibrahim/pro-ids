<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InstructorAnalyticsController extends Controller
{
    public function index()
    {
        $instructor = Auth::guard('api')->user();

        // Courses created
        $courses = Course::where('created_by', $instructor->id)->pluck('id');

        // Total enrollments
        $totalEnrollments = DB::table('enrollments')
            ->whereIn('course_id', $courses)
            ->count();

        // Quiz averages
        $quizAverages = QuizAttempt::select(
                'quiz_id',
                DB::raw('AVG(score) as average_score')
            )
            ->whereIn('quiz_id', function ($q) use ($courses) {
                $q->select('id')
                  ->from('quizzes')
                  ->whereIn('course_id', $courses);
            })
            ->groupBy('quiz_id')
            ->get();

        // Top & low performing quizzes
        $topQuizzes = $quizAverages->sortByDesc('average_score')->take(3)->values();
        $lowQuizzes = $quizAverages->sortBy('average_score')->take(3)->values();

        return response()->json([
            'courses_created' => $courses->count(),
            'total_enrollments' => $totalEnrollments,
            'quiz_averages' => $quizAverages,
            'top_quizzes' => $topQuizzes,
            'low_quizzes' => $lowQuizzes,
        ]);
    }
}