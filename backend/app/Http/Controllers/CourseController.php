<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        // Only show approved courses to students, instructors see all their own
        if (Auth::user()->role === 'student') {
            $query->where('is_approved', true);
        }

        // Spec 3.9: Search & Filtering
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        if ($request->has('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        return response()->json($query->latest()->get());
    }

    public function show(Course $course)
    {
        return response()->json(['data' => $course->load(['lessons', 'quizzes'])]);
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

        $course = $request->user()->taughtCourses()->create($data);
        return response()->json(['data' => $course], 201);
    }

    // Spec 2.2: Admin Approval
    public function approve(Course $course)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'instructor') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }
        $course->update(['is_approved' => true]);
        return response()->json(['message' => 'Course approved and live.']);
    }
}