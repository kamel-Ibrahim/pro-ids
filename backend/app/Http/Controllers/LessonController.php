<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    // GET /api/courses/{course}/lessons
    public function index(Course $course)
    {
        return response()->json([
            'data' => $course->lessons()->orderBy('order')->get()
        ]);
    }

    // POST /api/courses/{course}/lessons
    public function store(Request $request, Course $course)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'video_url' => 'nullable|string',
            'duration' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $lesson = $course->lessons()->create($data);

        return response()->json(['data' => $lesson], 201);
    }
}