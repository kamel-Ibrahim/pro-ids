<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Certificate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    public function generate($courseId)
    {
        $user = Auth::guard('api')->user();
        $course = Course::with(['lessons', 'quizzes'])->findOrFail($courseId);

        // 1. Verify Lesson Completion
        $totalLessons = $course->lessons->count();
        $completedCount = DB::table('lesson_progress')
            ->where('user_id', $user->id)
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->where('completed', true)
            ->count();

        if ($totalLessons > 0 && $completedCount < $totalLessons) {
            return response()->json(['message' => 'Complete all lessons first.'], 403);
        }

        // 2. Verify Quiz (at least one pass)
        if ($course->quizzes->count() > 0) {
            $passed = DB::table('quiz_attempts')
                ->where('user_id', $user->id)
                ->whereIn('quiz_id', $course->quizzes->pluck('id'))
                ->where('score', '>=', 60)
                ->exists();

            if (!$passed) {
                return response()->json(['message' => 'Pass the assessment first.'], 403);
            }
        }

        $certificate = Certificate::firstOrCreate(
            ['course_id' => $course->id, 'user_id' => $user->id],
            ['verification_code' => strtoupper(Str::random(10)), 'issued_at' => now()]
        );

        $pdf = Pdf::loadView('certificates.template', [
            'student' => $user->name,
            'course' => $course->title,
            'date' => now()->format('Y-m-d'),
            'instructor' => $course->instructor->name ?? 'Instructor',
            'code' => $certificate->verification_code,
        ]);

        return $pdf->stream("Certificate-{$course->id}.pdf");
    }

    public function download($courseId)
    {
        return $this->generate($courseId);
    }
}