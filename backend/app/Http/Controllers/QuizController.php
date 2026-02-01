<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\QuizAttempt;

class QuizController extends Controller
{
    public function show(Quiz $quiz)
    {
        return $quiz->load('questions.options');
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $data = $request->validate([
            'answers' => 'required|array',
        ]);

        $score = 0;
        $total = $quiz->questions->count();

        foreach ($quiz->questions as $question) {
            if (
                isset($data['answers'][$question->id]) &&
                $question->correct_option_id == $data['answers'][$question->id]
            ) {
                $score++;
            }
        }

        QuizAttempt::create([
            'user_id' => auth()->id(),
            'quiz_id' => $quiz->id,
            'score' => $score,
            'total' => $total,
        ]);

        return response()->json([
            'score' => $score,
            'total' => $total,
        ]);
    }
}