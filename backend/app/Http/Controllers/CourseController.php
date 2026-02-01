<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Public course listing with search & filtering (Student-facing)
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:200',
            'category' => 'nullable|string|max:100',
            'difficulty' => 'nullable|string|max:50',
            'sort' => 'nullable|in:popular,newest',
        ]);

        $query = Course::query()->where('published', true);

        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        if (!empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        if (!empty($validated['difficulty'])) {
            $query->where('difficulty', $validated['difficulty']);
        }

        // Sorting
        if (($validated['sort'] ?? 'newest') === 'popular') {
            // Use enrollments_count (since your schema has enrollments)
            $query->withCount('enrollments')->orderByDesc('enrollments_count');
        } else {
            $query->orderByDesc('created_at');
        }

        // Pagination prevents giant payloads and frontend “hangs”
        $perPage = min(max((int) $request->input('per_page', 12), 1), 50);

        return response()->json($query->paginate($perPage));
    }

    /**
     * Show course details
     */
    public function show(Course $course)
    {
        if (!$course->published) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // If your frontend expects lessons, include them:
        // return response()->json($course->load('lessons'));

        return response()->json($course);
    }

    /**
     * Instructor creates course
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'difficulty' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|string|max:255',
        ]);

        $course = Course::create([
            'instructor_id' => Auth::id(),
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category' => $data['category'] ?? null,
            'difficulty' => $data['difficulty'] ?? null,
            'thumbnail' => $data['thumbnail'] ?? null,
            'published' => false,
        ]);

        return response()->json($course, 201);
    }

    /**
     * Instructor course list
     */
    public function myCourses()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json(
            Course::where('instructor_id', Auth::id())
                ->orderByDesc('created_at')
                ->get()
        );
    }

    /**
     * Publish course
     */
    public function publish(Course $course)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ((int) $course->instructor_id !== (int) Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $course->update(['published' => true]);

        return response()->json(['message' => 'Course published successfully']);
    }
}