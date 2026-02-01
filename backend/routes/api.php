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

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (JWT Protected)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api'])->group(function () {
    
    // User Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Universal Dashboard (Logic handled in controller for Student vs Instructor)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    /* --- Course Discovery (Student & Instructor) --- */
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    /* 
    |----------------------------------------------------------------------
    | Student Routes (Spec 3.4, 3.6, 3.7, 3.8)
    |----------------------------------------------------------------------
    */
    // Enrollment
    Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'store']);
    
    // Lessons & Progress Tracking
    Route::get('/courses/{course}/lessons', [LessonController::class, 'index']);
    Route::post('/lessons/{lesson}/complete', [LessonProgressController::class, 'complete']);
    Route::get('/courses/{course}/progress', [ProgressController::class, 'courseProgress']);

    // Quiz Taking
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);
    Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);

    // Certificates
    Route::post('/courses/{course}/certificate/generate', [CertificateController::class, 'generate']);
    Route::get('/courses/{course}/certificate/download', [CertificateController::class, 'download']);


    /* 
    |----------------------------------------------------------------------
    | Instructor Routes (Spec 3.3, 3.4, 3.5, 3.10)
    |----------------------------------------------------------------------
    | Note: These should ideally be wrapped in a 'role:instructor' middleware
    */
    Route::middleware(['role:instructor'])->group(function () {
        
        // Course Management
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        
        // Lesson Management
        Route::post('/courses/{course}/lessons', [LessonController::class, 'store']);
        
        // Quiz & Question Management (Builder)
        Route::post('/courses/{course}/quizzes', [QuizController::class, 'store']);
        Route::post('/quizzes/{quiz}/questions', [QuizQuestionController::class, 'store']);
        
        // Analytics
        Route::get('/instructor/analytics', [InstructorAnalyticsController::class, 'index']);
    });

});