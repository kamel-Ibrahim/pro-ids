<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class QuizAttemptController extends Controller
{
    /**
     * Start & submit a quiz attempt.
     */
    public function store(Request $request, Quiz $quiz)
    {
        $user = Auth::guard('api')->user();

        $request->validate([
            'answers' => 'required|array',
            'started_at' => 'required|date',
        ]);

        // ----- Time limit enforcement -----
        if ($quiz->time_limit) {
            $startedAt = Carbon::parse($request->started_at);
            $elapsedMinutes = $startedAt->diffInMinutes(now());

            if ($elapsedMinutes > $quiz->time_limit) {
                return response()->json([
                    'message' => 'Quiz time limit exceeded.'
                ], 403);
            }
        }

        // ----- Load questions (shuffle if enabled) -----
        $questionsQuery = $quiz->questions()->with('options');

        $questions = $quiz->shuffle_questions
            ? $questionsQuery->inRandomOrder()->get()
            : $questionsQuery->get();

        // ----- Scoring -----
        $score = 0;
        $total = $questions->count();

        foreach ($questions as $question) {
            $submitted = $request->answers[$question->id] ?? null;

            if ($submitted === null) {
                continue;
            }

            $correctOptions = $question->options->where('is_correct', true)->pluck('id')->sort()->values();

            // MSQ (multiple select)
            if ($question->question_type === 'MSQ') {
                $submittedOptions = collect($submitted)->sort()->values();

                if ($submittedOptions->equals($correctOptions)) {
                    $score++;
                }
            }
            // MCQ / TF (single answer)
            else {
                if (in_array($submitted, $correctOptions->toArray(), true)) {
                    $score++;
                }
            }
        }

        $percentage = $total > 0 ? round(($score / $total) * 100) : 0;

        // ----- Store attempt -----
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $user->id,
            'score' => $percentage,
        ]);

        return response()->json([
            'attempt_id' => $attempt->id,
            'score' => $percentage,
            'passed' => $percentage >= $quiz->passing_score,
        ]);
    }
}