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

    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    /* STUDENT FLOW */
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store']);
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/lessons/{lesson}/complete', [LessonProgressController::class, 'complete']);
    Route::get('/courses/{course}/progress', [ProgressController::class, 'courseProgress']);
    
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);

    Route::get('/courses/{course}/certificate/generate', [CertificateController::class, 'generate']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    /* INSTRUCTOR FLOW - FULL CRUD */
    Route::middleware(['role:instructor'])->group(function () {
        // Course Management
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);
        
        // Lesson Management
        Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
        Route::put('/lessons/{lesson}', [LessonController::class, 'update']);
        Route::delete('/lessons/{lesson}', [LessonController::class, 'destroy']);
        
        // Quiz Management
        Route::post('/courses/{course}/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{quiz}', [QuizController::class, 'update']);
        Route::delete('/quizzes/{quiz}', [QuizController::class, 'destroy']);
        
        Route::post('/quizzes/{quiz}/questions', [QuizQuestionController::class, 'store']);
        Route::delete('/questions/{question}', [QuizQuestionController::class, 'destroy']);
        
        Route::get('/instructor/analytics', [InstructorAnalyticsController::class, 'index']);
    });
});