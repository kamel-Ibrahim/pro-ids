<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Certificate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;

class CertificateController extends Controller
{
    /**
     * Generate certificate if course is completed.
     */
    public function generate($courseId)
    {
        $user = Auth::guard('api')->user();

        $course = Course::with(['lessons', 'quiz', 'instructor'])->findOrFail($courseId);

        // ----- Verify lesson completion -----
        $totalLessons = $course->lessons()->count();

        $completedLessons = $course->lessons()
            ->whereHas('progress', function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->where('completed', true);
            })
            ->count();

        if ($totalLessons > 0 && $completedLessons !== $totalLessons) {
            return response()->json([
                'message' => 'Course lessons not fully completed.'
            ], 403);
        }

        // ----- Verify quiz passing -----
        if ($course->quiz) {
            $latestAttempt = $course->quiz->attempts()
                ->where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->first();

            if (!$latestAttempt || $latestAttempt->score < $course->quiz->passing_score) {
                return response()->json([
                    'message' => 'Required quiz not passed.'
                ], 403);
            }
        }

        // ----- Prevent duplicate certificates -----
        $existing = Certificate::where('course_id', $course->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json($existing);
        }

        // ----- Generate certificate -----
        $verificationCode = strtoupper(Str::random(10));

        $pdf = Pdf::loadView('certificates.template', [
            'student' => $user->name,
            'course' => $course->title,
            'date' => now()->format('Y-m-d'),
            'instructor' => $course->instructor->name ?? 'Instructor',
            'code' => $verificationCode,
        ]);

        $path = 'certificates/' . $verificationCode . '.pdf';

        Storage::disk('public')->put($path, $pdf->output());

        $certificate = Certificate::create([
            'course_id' => $course->id,
            'user_id' => $user->id,
            'download_url' => $path,
            'verification_code' => $verificationCode,
            'generated_at' => now(),
        ]);

        return response()->json($certificate);
    }

    /**
     * Download certificate PDF.
     */
    public function download($courseId)
    {
        $user = Auth::guard('api')->user();

        $certificate = Certificate::where('course_id', $courseId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->download(
            storage_path('app/public/' . $certificate->download_url)
        );
    }
}