<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Course;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class QuizController extends Controller
{
    /**
     * Display the quiz with questions and options for taking/previewing.
     */
    public function show(Quiz $quiz)
    {
        return response()->json([
            'data' => $quiz->load('questions.options')
        ]);
    }

    /**
     * Instructor: Create a new quiz for a course (Spec 3.5)
     */
    public function store(Request $request, Course $course)
    {
        // 1. Permission check: Only the instructor of the course can add a quiz
        if ($course->instructor_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden: You do not own this course'], 403);
        }

        // 2. Validation based on Spec 3.5
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'passing_score' => 'required|integer|min:0|max:100',
            'time_limit' => 'nullable|integer|min:1',
            'shuffle_questions' => 'boolean',
        ]);

        // 3. Create quiz linked to course
        $quiz = $course->quizzes()->create($data);

        return response()->json([
            'message' => 'Quiz configuration saved successfully',
            'data' => $quiz
        ], 201);
    }

    /**
     * Student: Submit quiz answers and calculate score (Spec 3.6 & 3.7)
     */
    public function submit(Request $request, Quiz $quiz)
    {
        $request->validate([
            'answers' => 'required|array', // Format: { question_id: option_id }
        ]);

        $userAnswers = $request->input('answers');
        $questions = $quiz->questions()->with('options')->get();
        
        $totalQuestions = $questions->count();
        $correctCount = 0;

        foreach ($questions as $question) {
            $submittedOptionId = $userAnswers[$question->id] ?? null;

            // Find the correct option for this question
            $correctOption = $question->options->where('is_correct', true)->first();

            if ($submittedOptionId && $correctOption && $submittedOptionId == $correctOption->id) {
                $correctCount++;
            }
        }

        // Calculate percentage
        $scorePercentage = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0;

        // Store the attempt (Spec 3.6)
        $attempt = QuizAttempt::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quiz->id,
            'score' => $scorePercentage,
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully',
            'data' => [
                'score' => $scorePercentage,
                'correct_answers' => $correctCount,
                'total_questions' => $totalQuestions,
                'passed' => $scorePercentage >= $quiz->passing_score,
                'attempt_id' => $attempt->id
            ]
        ]);
    }
}