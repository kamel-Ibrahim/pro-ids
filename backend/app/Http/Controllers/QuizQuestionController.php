<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;

class QuizQuestionController extends Controller
{
    public function store(Request $request, Quiz $quiz)
    {
        // 1. Validation
        $data = $request->validate([
            'text' => 'required|string',
            'type' => 'required|in:MCQ,TF,MSQ',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.is_correct' => 'required|boolean',
        ]);

        // 2. Create the question
        $question = $quiz->questions()->create([
            'text' => $data['text'],
            'multiple' => $data['type'] === 'MSQ'
        ]);

        // 3. Create the options - Map 'text' from frontend to 'option_text' in DB
        foreach ($data['options'] as $opt) {
            $question->options()->create([
                'option_text' => $opt['text'], 
                'is_correct' => $opt['is_correct']
            ]);
        }

        return response()->json(['message' => 'Question saved successfully'], 201);
    }
}