// src/services/api.js
import axios from 'axios'
import courses from '../mock-data/courses.json'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const ENROLL_KEY = 'tm_enrollments'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('tm_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('tm_token')
    delete api.defaults.headers.common['Authorization']
  }
}

const saved = localStorage.getItem('tm_token')
if (saved) {
  api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

// Mock endpoints
export const fetchCourses = async () => {
  await new Promise((r) => setTimeout(r, 150))
  return { data: courses }
}

export const fetchCourseById = async (id) => {
  await new Promise((r) => setTimeout(r, 120))
  const course = courses.find((c) => String(c.id) === String(id))
  if (!course) throw new Error('Course not found')
  return { data: course }
}

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
    completedLessons: []
  }
  enrollments.push(newEnroll)
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments))
  return { data: newEnroll }
}

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

export const getEnrollmentForCourse = async (courseId) => {
  await new Promise((r) => setTimeout(r, 100))
  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []
  const enrollment = enrollments.find(e => String(e.courseId) === String(courseId))
  return { data: enrollment || null }
}

export const updateProgress = async (courseId, lessonIdentifier) => {
  await new Promise((r) => setTimeout(r, 150))
  const raw = localStorage.getItem(ENROLL_KEY)
  const enrollments = raw ? JSON.parse(raw) : []
  const idx = enrollments.findIndex(e => String(e.courseId) === String(courseId))
  if (idx === -1) throw new Error('Not enrolled in course')

  const enrollment = enrollments[idx]
  enrollment.completedLessons = enrollment.completedLessons || []

  if (!enrollment.completedLessons.includes(lessonIdentifier)) {
    enrollment.completedLessons.push(lessonIdentifier)
  }

  const course = courses.find(c => String(c.id) === String(courseId)) || {}
  const totalLessons = (course.modules && course.modules.length) || 0
  const completedCount = enrollment.completedLessons.length
  enrollment.progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  enrollments[idx] = enrollment
  localStorage.setItem(ENROLL_KEY, JSON.stringify(enrollments))

  return { data: enrollment }
}

export default api
