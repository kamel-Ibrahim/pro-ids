<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Course;

class EnrollmentController extends Controller
{
    public function store(Course $course)
    {
        $user = auth()->user();

        Enrollment::firstOrCreate([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);

        return response()->json(['enrolled' => true]);
    }
}