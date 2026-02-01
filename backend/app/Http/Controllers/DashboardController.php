<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // This is the import
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // --- Instructor Logic ---
        if ($user->role === 'instructor') {
            return response()->json([
                'courses' => Course::where('instructor_id', $user->id)
                    ->withCount('enrollments')
                    ->get(),
            ]);
        }

        // --- Student Logic (Spec 3.7 Progress Tracking) ---
        // We call the relationship and calculate progress for each course
        $enrollments = $user->enrollments()
            ->with('course.lessons')
            ->get()
            ->map(function ($e) use ($user) {
                $totalLessons = $e->course->lessons->count();

                // FIXED: Removed the backslash from \DB to use the imported Facade correctly
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

        return response()->json([
            'enrollments' => $enrollments
        ]);
    }
}