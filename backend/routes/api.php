<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\InstructorAnalyticsController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:api'])->group(function () {
    
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Course Discovery
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    /* STUDENT FLOW */
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store']);
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/lessons/{lesson}/complete', [LessonProgressController::class, 'complete']);
    Route::get('/courses/{course}/progress', [ProgressController::class, 'courseProgress']);
    
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);

    Route::post('/courses/{course}/certificate/generate', [CertificateController::class, 'generate']);
    Route::get('/courses/{course}/certificate/download', [CertificateController::class, 'download']);

    /* INSTRUCTOR FLOW */
    Route::middleware(['role:instructor'])->group(function () {
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
        Route::post('/courses/{course}/quizzes', [QuizController::class, 'store']);
        Route::post('/quizzes/{quiz}/questions', [QuizQuestionController::class, 'store']);
        Route::get('/instructor/analytics', [InstructorAnalyticsController::class, 'index']);
    });
});