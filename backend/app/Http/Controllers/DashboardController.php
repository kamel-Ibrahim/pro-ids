<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'instructor') {
            return response()->json([
                'courses' => Course::where('instructor_id', $user->id)->withCount('enrollments')->get(),
            ]);
        }

        return response()->json([
            'enrollments' => Enrollment::with('course')
                ->where('user_id', $user->id)
                ->get(),
        ]);
    }
}