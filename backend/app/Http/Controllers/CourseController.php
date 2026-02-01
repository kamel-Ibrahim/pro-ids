<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('instructor')->latest()->get();
    }

    // FIX: Explicitly load relationships so the "Manage" page has data
    public function show(Course $course)
    {
        return response()->json([
            'data' => $course->load(['lessons', 'quizzes'])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'estimated_duration' => 'required|string',
        ]);

        // Ensure your User model has the taughtCourses() relationship defined
        $course = $request->user()->taughtCourses()->create($data);

        return response()->json(['data' => $course], 201);
    }
}