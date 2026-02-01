<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LessonController extends Controller
{
    public function index(Course $course)
    {
        return response()->json([
            'data' => $course->lessons()->orderBy('order')->get()
        ]);
    }

    public function store(Request $request, Course $course)
    {
        if ($course->instructor_id !== Auth::id()) abort(403);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string', // Will store <iframe> code
            'duration' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $lesson = $course->lessons()->create($data);

        return response()->json(['data' => $lesson], 201);
    }

    public function update(Request $request, Lesson $lesson)
    {
        if ($lesson->course->instructor_id !== Auth::id()) abort(403);

        $data = $request->validate([
            'title' => 'string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string',
            'duration' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $lesson->update($data);

        return response()->json(['data' => $lesson]);
    }
}