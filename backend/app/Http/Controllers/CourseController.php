<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request; // THIS WAS MISSING
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        // Direct array return for simplicity in frontend
        return Course::with('instructor')->latest()->get();
    }

    public function show(Course $course)
    {
        return $course->load('quizzes.questions.options');
    }

    public function store(Request $request)
    {
        // 1. Validation based on PDF Spec 3.3
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'estimated_duration' => 'required|string',
            'thumbnail' => 'nullable|string', // PDF Spec asks for thumbnail
        ]);

        // 2. Ensure only instructors can do this
        if ($request->user()->role !== 'instructor') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 3. Create the course using the relationship
        // This automatically sets the instructor_id
        $course = $request->user()->taughtCourses()->create($data);

        return response()->json([
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }
}