<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\{
    CourseController,
    LessonController,
    QuizController,
    QuizQuestionController,
    QuizOptionController,
    QuizAttemptController,
    ProgressController,
    CertificateController
};

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth / Profile
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | INSTRUCTOR ROUTES
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:instructor')->group(function () {

        // Courses
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/instructor/courses', [CourseController::class, 'myCourses']);
        Route::post('/courses/{course}/publish', [CourseController::class, 'publish']);

        // Lessons
        Route::post('/lessons', [LessonController::class, 'store']);

        // Quizzes
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::post('/quiz-questions', [QuizQuestionController::class, 'store']);
        Route::post('/quiz-options', [QuizOptionController::class, 'store']);
    });

    /*
    |--------------------------------------------------------------------------
    | STUDENT ROUTES
    |--------------------------------------------------------------------------
    */

    // Browse courses
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    // Lesson progress
    Route::post('/lessons/{lesson}/complete', [LessonController::class, 'complete']);

    // Quiz attempts
    Route::post('/quizzes/{quiz}/submit', [QuizAttemptController::class, 'submit']);

    // Course progress
    Route::get('/courses/{course}/progress', [ProgressController::class, 'courseProgress']);

    // Certificate
    Route::post('/courses/{course}/certificate', [CertificateController::class, 'generate']);
});