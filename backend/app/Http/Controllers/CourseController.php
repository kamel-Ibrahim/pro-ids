<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('instructor');

        // Spec 2.2: Students only see approved courses
        // Instructors see all courses
        if (Auth::check() && Auth::user()->role === 'student') {
            $query->where('is_approved', true);
        }

        // Spec 3.9: Search & Filtering
        if ($request->has('search') && $request->search != '') {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->has('category') && $request->category != '') {
            $query->where('category', $request->category);
        }

        return response()->json($query->latest()->get());
    }

    public function show(Course $course)
    {
        // Load nested data for the Course Details and Management pages
        return response()->json([
            'data' => $course->load(['lessons', 'quizzes', 'instructor'])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'difficulty' => 'required|in:Beginner,Intermediate,Advanced',
            'estimated_duration' => 'required|string',
        ]);

        /** @var User $user */
        $user = $request->user();

        // Automatically set is_approved to true for now so students can see it
        $data['is_approved'] = true; 

        $course = $user->taughtCourses()->create($data);

        return response()->json(['data' => $course], 201);
    }
}