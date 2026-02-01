<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Course::with('instructor');

        if ($user && $user->role === 'instructor') {
            $query->where('instructor_id', $user->id);
        } else {
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
        $data['is_approved'] = true; 
        $course = Course::create($data);
        return response()->json(['data' => $course], 201);
    }

    public function update(Request $request, Course $course)
    {
        if ($course->instructor_id !== Auth::id()) abort(403);
        $course->update($request->all());
        return response()->json(['data' => $course]);
    }

    public function destroy(Course $course)
    {
        if ($course->instructor_id !== Auth::id()) abort(403);
        $course->delete();
        return response()->json(['message' => 'Course deleted']);
    }

    public function show(Course $course)
    {
        return response()->json(['data' => $course->load(['lessons', 'quizzes', 'instructor'])]);
    }
}