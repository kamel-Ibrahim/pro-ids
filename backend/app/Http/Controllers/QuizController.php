<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Course;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    public function show(Quiz $quiz)
    {
        return response()->json(['data' => $quiz->load('questions.options')]);
    }

    // POST /api/courses/{course}/quizzes
    public function store(Request $request, Course $course)
{
    // 1. Check permissions
    if ($course->instructor_id !== $request->user()->id) {
        return response()->json(['message' => 'Forbidden'], 403);
    }

    // 2. Validate based on Spec 3.5
    $data = $request->validate([
        'title' => 'required|string|max:255',
        'passing_score' => 'required|integer|min:0|max:100',
        'time_limit' => 'nullable|integer|min:1',
        'shuffle_questions' => 'boolean',
    ]);

    // 3. Create quiz
    $quiz = $course->quizzes()->create($data);

    return response()->json([
        'message' => 'Quiz created',
        'data' => $quiz
    ], 201);
}
}