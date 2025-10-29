// src/services/api.js
// Combined helpers: token management + mock API for enrollments + progress updates.

import axios from 'axios'
import courses from '../mock-data/courses.json'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const ENROLL_KEY = 'tm_enrollments'

// Axios instance (used later when connecting to real backend)
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Attach or clear Authorization header
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('tm_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('tm_token')
    delete api.defaults.headers.common['Authorization']
  }
}

// Restore token on load if available
const saved = localStorage.getItem('tm_token')
if (saved) {
  api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

// ---- Mocked endpoints (temporary until backend integration) ----

// Fetch all courses
export const fetchCourses = async () => {
  await new Promise((r) => setTimeout(r, 150))
  return { data: courses }
}

// Fetch single course
export const fetchCourseById = async (id) => {
  await new Promise((r) => setTimeout(r, 120))
  const course = courses.find((c) => String(c.id) === String(id))
  if (!course) throw new Error('Course not found')
  return { data: course }
}

// Enroll in a course (localStorage mock)
export const enrollCourse = async (courseId) => {
  await new Promise((r) => setTimeout(r, 200))
  const course = courses.find((c) => String(c.id) === String(courseId))
  if (!course) throw new Error('Course not found')

  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []

  if (enrollments.find((e) => String(e.courseId) === String(courseId))) {
    return { data: { message: 'already enrolled' } }
  }

  const newEnroll = {
    id: Date.now(),
    courseId: course.id,
    title: course.title,
    enrolledAt: new Date().toISOString(),
    progressPercent: 0,
    completedLessons: [] // will store lesson ids or indices
  }
  enrollments.push(newEnroll)
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments))
  return { data: newEnroll }
}

// Get all enrollments (localStorage mock)
export const getMyEnrollments = async () => {
  await new Promise((r) => setTimeout(r, 120))
  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []
  const enriched = enrollments.map((e) => {
    const course = courses.find((c) => String(c.id) === String(e.courseId)) || {}
    return { ...e, course }
  })
  return { data: enriched }
}

// Get single enrollment for given courseId
export const getEnrollmentForCourse = async (courseId) => {
  await new Promise((r) => setTimeout(r, 100))
  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []
  const enrollment = enrollments.find(e => String(e.courseId) === String(courseId))
  return { data: enrollment || null }
}

// Update progress by marking a lesson complete.
// lessonId can be an index or id depending on your modules model.
export const updateProgress = async (courseId, lessonIdentifier) => {
  // simulate network latency
  await new Promise((r) => setTimeout(r, 150))

  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []
  const idx = enrollments.findIndex(e => String(e.courseId) === String(courseId))
  if (idx === -1) throw new Error('Not enrolled in course')

  const enrollment = enrollments[idx]
  enrollment.completedLessons = enrollment.completedLessons || []

  // Avoid duplicates
  if (!enrollment.completedLessons.includes(lessonIdentifier)) {
    enrollment.completedLessons.push(lessonIdentifier)
  }

  // Compute progress percent based on course module count
  const course = courses.find(c => String(c.id) === String(courseId)) || {}
  const totalLessons = (course.modules && course.modules.length) || 0
  const completedCount = enrollment.completedLessons.length
  enrollment.progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // write back
  enrollments[idx] = enrollment
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments))

  return { data: enrollment }
}

// Default export so we can still use api when backend is ready
export default api
