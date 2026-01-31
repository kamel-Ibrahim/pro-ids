import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCourseProgress } from '../../api/instructorAnalytics.api'
import type { StudentProgress } from '../../api/instructorAnalytics.api'

export default function CourseAnalytics() {
  const { courseId } = useParams()
  const [data, setData] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return

    getCourseProgress(Number(courseId))
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <CircularProgress />

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Course Analytics
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Lessons</TableCell>
            <TableCell>Quiz</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((s) => (
            <TableRow key={s.student_id}>
              <TableCell>{s.student_name}</TableCell>

              <TableCell>
                {s.lessons_completed}/{s.total_lessons}
              </TableCell>

              <TableCell>
                {s.quiz_score === null
                  ? 'Not taken'
                  : `${s.quiz_score}%`}
              </TableCell>

              <TableCell>
                {s.completed ? (
                  <Chip color="success" label="Completed" />
                ) : s.quiz_passed ? (
                  <Chip color="warning" label="In Progress" />
                ) : (
                  <Chip color="error" label="Incomplete" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}