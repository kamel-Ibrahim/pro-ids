<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::guard('api')->user();

        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        // INSTRUCTOR: Only see stats/courses they created
        if ($user->role === 'instructor') {
            return response()->json([
                'courses' => Course::where('instructor_id', $user->id)
                    ->withCount('enrollments')
                    ->get(),
            ]);
        }

        // STUDENT: See courses they are enrolled in (regardless of instructor)
        $enrollments = $user->enrollments()
            ->with('course.lessons')
            ->get()
            ->map(function ($e) use ($user) {
                $totalLessons = $e->course->lessons->count();
                $completedCount = DB::table('lesson_progress')
                    ->where('user_id', $user->id)
                    ->whereIn('lesson_id', $e->course->lessons->pluck('id'))
                    ->where('completed', true)
                    ->count();

                $e->progress_percent = $totalLessons > 0 
                    ? round(($completedCount / $totalLessons) * 100) 
                    : 0;

                return $e;
            });

        return response()->json(['enrollments' => $enrollments]);
    }
}