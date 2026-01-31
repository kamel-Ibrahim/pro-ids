import http from './http'

export interface StudentProgress {
  student_id: number
  student_name: string
  lessons_completed: number
  total_lessons: number
  quiz_score: number | null
  quiz_passed: boolean
  completed: boolean
}

export function getCourseProgress(courseId: number) {
  return http.get<StudentProgress[]>(
    `/instructor/courses/${courseId}/progress`
  )
}