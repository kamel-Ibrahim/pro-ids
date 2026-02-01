<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuizQuestionController;
use App\Http\Controllers\QuizOptionController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\LessonProgressController;
use App\Http\Controllers\MyLearningController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\InstructorDashboardController;
use App\Http\Controllers\InstructorAnalyticsController;
use App\Http\Controllers\Api\Student\QuizAttemptController as StudentQuizAttemptController;
use App\Http\Controllers\Api\Instructor\QuizAttemptController as InstructorQuizAttemptController;

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/
Route::post("/register", [AuthController::class, "register"]);
Route::post("/login", [AuthController::class, "login"]);
Route::post("/instructor/register", [AuthController::class, "registerInstructor"]);

/*
|--------------------------------------------------------------------------
| Public Course Browsing (NO AUTH)
|--------------------------------------------------------------------------
*/
Route::get("/courses", [CourseController::class, "index"]);
Route::get("/courses/{course}", [CourseController::class, "show"]);
Route::get("/courses/{course}/lessons", [LessonController::class, "index"]);
Route::get("/quizzes/{quiz}", [QuizController::class, "show"]);

/*
|--------------------------------------------------------------------------
| Protected Routes (JWT)
|--------------------------------------------------------------------------
*/
Route::middleware("auth:api")->group(function () {

    Route::get("/me", [AuthController::class, "me"]);
    Route::post("/logout", [AuthController::class, "logout"]);

    /*
    |--------------------------------------------------------------------------
    | Student Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware("role:student")->group(function () {
        Route::get("/student/dashboard", [StudentDashboardController::class, "index"]);

        Route::post("/courses/{course}/enroll", [EnrollmentController::class, "enroll"]);
        Route::post("/lessons/{lesson}/complete", [LessonProgressController::class, "complete"]);

        Route::post("/student/quizzes/{quiz}/attempt", [StudentQuizAttemptController::class, "store"]);

        Route::get("/my-learning", [MyLearningController::class, "index"]);
        Route::get("/progress/{course}", [ProgressController::class, "courseProgress"]);

        Route::post("/certificate/{course}", [CertificateController::class, "generate"]);
        Route::get("/certificate/{course}", [CertificateController::class, "download"]);
    });

    /*
    |--------------------------------------------------------------------------
    | Instructor Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware("role:instructor")->group(function () {

        Route::get("/instructor/dashboard", [InstructorDashboardController::class, "index"]);
        Route::get("/instructor/analytics", [InstructorAnalyticsController::class, "index"]);

        Route::get("/instructor/courses", [CourseController::class, "myCourses"]);

        Route::post("/courses", [CourseController::class, "store"]);
        Route::put("/courses/{course}", [CourseController::class, "update"]);
        Route::delete("/courses/{course}", [CourseController::class, "destroy"]);
        Route::post("/courses/{course}/publish", [CourseController::class, "publish"]);

        Route::post("/courses/{course}/lessons", [LessonController::class, "store"]);

        Route::post("/quizzes", [QuizController::class, "store"]);
        Route::post("/quizzes/{quiz}/questions", [QuizQuestionController::class, "store"]);
        Route::post("/questions/{question}/options", [QuizOptionController::class, "store"]);

        Route::get("/instructor/quizzes/{quiz}/attempts", [InstructorQuizAttemptController::class, "index"]);
    });
});