<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MyLearningController extends Controller
{
    public function index()
{
    return response()->json([
        [
            "id" => 1,
            "title" => "Web Development Basics",
            "progress" => 35
        ],
        [
            "id" => 2,
            "title" => "React Fundamentals",
            "progress" => 100
        ]
    ]);
}
}