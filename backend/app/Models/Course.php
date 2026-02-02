<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'short_description',
        'description',
        'category',
        'difficulty',
        'estimated_duration',
        'thumbnail',
        'instructor_id',
        'is_approved', // ADDED THIS
        'published',   // ADDED THIS
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}