<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Auth;

class LessonProgressController extends Controller
{
    /**
     * Mark a lesson as completed by an enrolled student (Spec 3.4)
     */
    public function complete($lessonId)
    {
        // Use the authenticated user
        $user = Auth::user();

        if (!$user || $user->role !== 'student') {
            return response()->json(['message' => 'Only students can complete lessons'], 403);
        }

        $lesson = Lesson::findOrFail($lessonId);

        // Verify enrollment (Spec 2.1)
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json(['message' => 'You must be enrolled in the course first'], 403);
        }

        // Idempotent completion: firstOrCreate prevents duplicates
        $progress = LessonProgress::firstOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            ['completed' => true, 'completed_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Lesson marked as completed',
            'data' => $progress
        ]);
    }
}