<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'instructor_id',
        'title',
        'description',
        'category',
        'difficulty',
        'thumbnail',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // Optional: if you want "students" semantics via enrollments
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'user_id');
    }
}