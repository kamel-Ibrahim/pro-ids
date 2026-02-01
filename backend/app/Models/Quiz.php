<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
    'course_id', 
    'title', 
    'passing_score', 
    'time_limit', 
    'shuffle_questions', 
    'published'
];

    protected $casts = [
        'shuffle_questions' => 'boolean',
        'published' => 'boolean'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }
}