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

        // Enforce visibility: Only courses owned by this instructor
        $courses = Course::where('instructor_id', $instructor->id)->pluck('id');

        $totalEnrollments = DB::table('enrollments')
            ->whereIn('course_id', $courses)
            ->count();

        $quizAverages = QuizAttempt::select(
                'quiz_id',
                DB::raw('AVG(score) as average_score')
            )
            ->whereIn('quiz_id', function ($q) use ($courses) {
                $q->select('id')->from('quizzes')->whereIn('course_id', $courses);
            })
            ->groupBy('quiz_id')
            ->get();

        return response()->json([
            'courses_created' => $courses->count(),
            'total_enrollments' => $totalEnrollments,
            'quiz_averages' => $quizAverages,
        ]);
    }
}