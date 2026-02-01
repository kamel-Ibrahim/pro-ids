<?php

namespace App\Http\Controllers;

use App\Models\Course;

class CourseController extends Controller
{
    public function index()
    {
        return Course::with('instructor')->get();
    }

    public function show(Course $course)
    {
        return $course->load('quizzes.questions.options');
    }
}