<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Requirement:
     * - Students/Guests see ALL approved courses.
     * - Instructors ONLY see their own courses.
     */
    public function index(Request $request)
    {
        $user = Auth::guard('api')->user();
        $query = Course::with('instructor');

        if ($user && $user->role === 'instructor') {
            // Instructors only see their own work
            $query->where('instructor_id', $user->id);
        } else {
            // Students and unauthenticated users see all approved courses
            $query->where('is_approved', true);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'short_description' => 'required',
            'description' => 'required',
            'category' => 'required',
            'difficulty' => 'required',
            'estimated_duration' => 'required',
        ]);

        $data['instructor_id'] = Auth::id();
        $data['is_approved'] = true; // Default to true as per your current setup
        
        $course = Course::create($data);
        return response()->json(['data' => $course], 201);
    }

    public function update(Request $request, Course $course)
    {
        // Permission check: You can only edit your own courses
        if ($course->instructor_id !== Auth::id()) abort(403);
        
        $course->update($request->all());
        return response()->json(['data' => $course]);
    }

    public function destroy(Course $course)
    {
        // Permission check: You can only delete your own courses
        if ($course->instructor_id !== Auth::id()) abort(403);
        
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }

    public function show(Course $course)
    {
        return response()->json(['data' => $course->load(['lessons', 'quizzes', 'instructor'])]);
    }
}