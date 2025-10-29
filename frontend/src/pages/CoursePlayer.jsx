// src/pages/CoursePlayer.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchCourseById, getEnrollmentForCourse, updateProgress } from '../services/api'
import { useToast } from '../component/ui/ToastProvider'

export default function CoursePlayer() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetchCourseById(id)
        if (!mounted) return
        setCourse(res.data)
        const enr = await getEnrollmentForCourse(id)
        if (mounted) setEnrollment(enr?.data || null)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  const markComplete = async (lessonIdentifier) => {
    try {
      const res = await updateProgress(course.id, lessonIdentifier)
      setEnrollment(res.data)
      showToast('Lesson marked as complete')
    } catch (err) {
      showToast('Failed to update progress: ' + (err?.message || ''))
    }
  }

  if (loading) return <div className="text-gray-500">Loading player...</div>
  if (!course) return <div className="text-red-600">Course not found</div>

  const completed = enrollment?.completedLessons || []

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">{course.title} — Player</h2>
      <p className="text-sm text-gray-600 mt-1">{course.description}</p>

      <div className="mt-6">
        <h3 className="font-medium">Lessons</h3>
        <div className="mt-3 space-y-3">
          {(course.modules || []).map((m, idx) => {
            const lessonId = m.id ?? idx
            const isDone = completed.includes(lessonId)
            return (
              <div key={lessonId} className="border rounded p-3 flex items-start justify-between">
                <div>
                  <div className={`font-medium ${isDone ? 'line-through text-gray-500' : ''}`}>{m.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{m.description || 'Lesson content'}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => markComplete(lessonId)}
                    disabled={isDone}
                    className={`px-3 py-1 rounded ${isDone ? 'bg-gray-200 text-gray-500' : 'bg-indigo-600 text-white'}`}
                  >
                    {isDone ? 'Completed' : 'Mark complete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Progress: {enrollment?.progressPercent ?? 0}%
      </div>
    </div>
  )
}
