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

// Trainer course drafts (localStorage-backed) --------------------------------
const TRAINER_COURSES_KEY = 'tm_trainer_courses'

/**
 * Create or update a course draft for trainer.
 * If courseData.id exists => update; otherwise create new id.
 * courseData should include: title, shortDescription, description, price, modules: [{id,title,description,contentUrl}]
 */
export const createCourseDraft = async (trainerId, courseData) => {
  await new Promise(r => setTimeout(r, 150))
  const raw = localStorage.getItem(TRAINER_COURSES_KEY)
  const arr = raw ? JSON.parse(raw) : []
  if (courseData.id) {
    const idx = arr.findIndex(c => String(c.id) === String(courseData.id) && String(c.trainerId) === String(trainerId))
    if (idx === -1) throw new Error('Course not found or not permitted')
    arr[idx] = { ...arr[idx], ...courseData, trainerId }
  } else {
    const newCourse = {
      ...courseData,
      id: Date.now(),
      trainerId,
      createdAt: new Date().toISOString(),
      published: false
    }
    arr.push(newCourse)
  }
  localStorage.setItem(TRAINER_COURSES_KEY, JSON.stringify(arr))
  return { data: courseData.id ? courseData : arr[arr.length - 1] }
}

/**
 * Get courses created by trainer (local)
 */
export const getTrainerCourses = async (trainerId) => {
  await new Promise(r => setTimeout(r, 120))
  const raw = localStorage.getItem(TRAINER_COURSES_KEY)
  const arr = raw ? JSON.parse(raw) : []
  const list = arr.filter(c => String(c.trainerId) === String(trainerId))
  return { data: list }
}

// ---------------- Trainer application & admin (localStorage-backed) ----------------
const TRAINER_APPS_KEY = 'tm_trainer_applications'
const APPROVED_TRAINERS_KEY = 'tm_approved_trainers'

/**
 * Submit a trainer application (app contains: name, email, bio, portfolioUrl, createdAt)
 */
export const submitTrainerApplication = async (app) => {
  await new Promise(r => setTimeout(r, 200))
  const raw = localStorage.getItem(TRAINER_APPS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  const newApp = {
    id: Date.now(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    ...app
  }
  arr.push(newApp)
  localStorage.setItem(TRAINER_APPS_KEY, JSON.stringify(arr))
  return { data: newApp }
}

/**
 * Get all trainer applications (admin view)
 */
export const getTrainerApplications = async () => {
  await new Promise(r => setTimeout(r, 120))
  const raw = localStorage.getItem(TRAINER_APPS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  // newest first
  return { data: arr.sort((a,b) => b.createdAt.localeCompare(a.createdAt)) }
}

/**
 * Approve an application (sets status, and adds email to approved list)
 * Returns the updated application
 */
export const approveTrainerApplication = async (applicationId) => {
  await new Promise(r => setTimeout(r, 150))
  const raw = localStorage.getItem(TRAINER_APPS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  const idx = arr.findIndex(a => String(a.id) === String(applicationId))
  if (idx === -1) throw new Error('Application not found')
  arr[idx].status = 'APPROVED'
  arr[idx].approvedAt = new Date().toISOString()
  localStorage.setItem(TRAINER_APPS_KEY, JSON.stringify(arr))

  // add to approved trainers list (store by email)
  const approvedRaw = localStorage.getItem(APPROVED_TRAINERS_KEY)
  const approved = approvedRaw ? JSON.parse(approvedRaw) : []
  if (!approved.includes(arr[idx].email)) {
    approved.push(arr[idx].email)
    localStorage.setItem(APPROVED_TRAINERS_KEY, JSON.stringify(approved))
  }

  return { data: arr[idx] }
}

/**
 * Get approved trainers (list of emails)
 */
export const getApprovedTrainers = async () => {
  await new Promise(r => setTimeout(r, 80))
  const raw = localStorage.getItem(APPROVED_TRAINERS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  return { data: arr }
}

// ---------------- Admin expanded API (localStorage mocks) ----------------
const USERS_KEY = 'tm_users' // store basic users for admin operations
const ACTIVITY_LOG_KEY = 'tm_activity_log'
const COURSES_KEY = 'tm_trainer_courses' // existing trainer drafts / courses
// const ENROLL_KEY = 'tm_enrollments' // existing enrollments

// Ensure users list exists (seed from tm_user if present)
const ensureUsersSeeded = () => {
  const raw = localStorage.getItem(USERS_KEY)
  if (raw) return
  const maybe = localStorage.getItem('tm_user')
  const arr = []
  if (maybe) {
    try {
      const u = JSON.parse(maybe)
      if (u && u.email) arr.push({ id: u.id || Date.now(), name: u.name, email: u.email, role: u.role || 'LEARNER' })
    } catch (e) {
      console.error('Error seeding users:', e)
    }
  }
  // add a default admin for testing if none
  if (!arr.find(x => x.role === 'ADMIN')) {
    arr.push({ id: 'admin-1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' })
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(arr))
}

// Get all users (with basic info)
export const getAllUsers = async () => {
  await new Promise(r => setTimeout(r, 120))
  ensureUsersSeeded()
  const raw = localStorage.getItem(USERS_KEY) || '[]'
  const list = JSON.parse(raw)
  return { data: list }
}

const writeUsers = (list) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(list))
}

// Promote or demote user role (ADMIN/TRAINER/LEARNER)
export const updateUserRole = async (email, role) => {
  await new Promise(r => setTimeout(r, 120))
  ensureUsersSeeded()
  const raw = localStorage.getItem(USERS_KEY) || '[]'
  const list = JSON.parse(raw)
  const idx = list.findIndex(u => u.email === email)
  if (idx === -1) {
    // add user record
    const newU = { id: Date.now(), email, name: email.split('@')[0], role }
    list.push(newU)
    writeUsers(list)
    logActivity(`Role set: ${email} -> ${role}`)
    return { data: newU }
  }
  list[idx].role = role
  writeUsers(list)
  // If promoting to TRAINER add to approved trainers list
  if (role === 'TRAINER') {
    const approvedRaw = localStorage.getItem('tm_approved_trainers') || '[]'
    const approved = JSON.parse(approvedRaw)
    if (!approved.includes(email)) {
      approved.push(email)
      localStorage.setItem('tm_approved_trainers', JSON.stringify(approved))
    }
  }
  logActivity(`Role updated: ${email} -> ${role}`)
  return { data: list[idx] }
}

// Revoke trainer (remove from approved list and set role to LEARNER)
export const revokeTrainer = async (email) => {
  await new Promise(r => setTimeout(r, 120))
  const approvedRaw = localStorage.getItem('tm_approved_trainers') || '[]'
  const approved = JSON.parse(approvedRaw)
  const updated = approved.filter(e => e !== email)
  localStorage.setItem('tm_approved_trainers', JSON.stringify(updated))
  // update users list
  ensureUsersSeeded()
  const usersRaw = localStorage.getItem(USERS_KEY) || '[]'
  const users = JSON.parse(usersRaw)
  const uidx = users.findIndex(u => u.email === email)
  if (uidx !== -1) { users[uidx].role = 'LEARNER'; writeUsers(users) }
  logActivity(`Trainer revoked: ${email}`)
  return { data: { email } }
}

// Courses management helpers (publish/unpublish/delete)
export const getAllCoursesAdmin = async () => {
  await new Promise(r => setTimeout(r, 150))
  const raw = localStorage.getItem(COURSES_KEY) || '[]'
  const list = JSON.parse(raw)
  return { data: list }
}

export const publishCourse = async (courseId) => {
  await new Promise(r => setTimeout(r, 120))
  const raw = localStorage.getItem(COURSES_KEY) || '[]'
  const list = JSON.parse(raw)
  const idx = list.findIndex(c => String(c.id) === String(courseId))
  if (idx === -1) throw new Error('Course not found')
  list[idx].published = true
  list[idx].publishedAt = new Date().toISOString()
  localStorage.setItem(COURSES_KEY, JSON.stringify(list))
  logActivity(`Course published: ${list[idx].title}`)
  return { data: list[idx] }
}

export const unpublishCourse = async (courseId) => {
  await new Promise(r => setTimeout(r, 120))
  const raw = localStorage.getItem(COURSES_KEY) || '[]'
  const list = JSON.parse(raw)
  const idx = list.findIndex(c => String(c.id) === String(courseId))
  if (idx === -1) throw new Error('Course not found')
  list[idx].published = false
  localStorage.setItem(COURSES_KEY, JSON.stringify(list))
  logActivity(`Course unpublished: ${list[idx].title}`)
  return { data: list[idx] }
}

export const deleteCourseAdmin = async (courseId) => {
  await new Promise(r => setTimeout(r, 120))
  const raw = localStorage.getItem(COURSES_KEY) || '[]'
  let list = JSON.parse(raw)
  const idx = list.findIndex(c => String(c.id) === String(courseId))
  if (idx === -1) throw new Error('Course not found')
  const removed = list.splice(idx,1)[0]
  localStorage.setItem(COURSES_KEY, JSON.stringify(list))
  logActivity(`Course deleted: ${removed.title}`)
  return { data: removed }
}

// Enrollments admin
export const getAllEnrollmentsAdmin = async () => {
  await new Promise(r => setTimeout(r, 100))
  const raw = localStorage.getItem(ENROLL_KEY) || '[]'
  const list = JSON.parse(raw)
  // enrich with course title if possible
  const coursesRaw = localStorage.getItem(COURSES_KEY) || '[]'
  const courses = JSON.parse(coursesRaw)
  const enriched = list.map(e => {
    const course = courses.find(c => String(c.id) === String(e.courseId)) || {}
    return { ...e, courseTitle: course.title || e.title || 'Unknown' }
  })
  return { data: enriched }
}

export const revokeEnrollmentAdmin = async (enrollmentId) => {
  await new Promise(r => setTimeout(r, 100))
  const raw = localStorage.getItem(ENROLL_KEY) || '[]'
  let list = JSON.parse(raw)
  const idx = list.findIndex(e => String(e.id) === String(enrollmentId))
  if (idx === -1) throw new Error('Enrollment not found')
  const removed = list.splice(idx,1)[0]
  localStorage.setItem(ENROLL_KEY, JSON.stringify(list))
  logActivity(`Enrollment revoked: ${removed.courseId} for enrollment ${removed.id}`)
  return { data: removed }
}

// Activity log helpers
export const logActivity = (message) => {
  const raw = localStorage.getItem(ACTIVITY_LOG_KEY) || '[]'
  const arr = JSON.parse(raw)
  arr.unshift({ id: Date.now(), message, ts: new Date().toISOString() })
  // keep last 200
  localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(arr.slice(0,200)))
}

export const getActivityLog = async () => {
  await new Promise(r => setTimeout(r, 80))
  const raw = localStorage.getItem(ACTIVITY_LOG_KEY) || '[]'
  return { data: JSON.parse(raw) }
}

// append to services/api.js
export const getPublishedCourses = async () => {
  await new Promise(r => setTimeout(r, 120))
  // courses can come from trainer drafts (tm_trainer_courses) or the original mock
  const raw = localStorage.getItem('tm_trainer_courses') || '[]'
  const arr = JSON.parse(raw)
  const published = arr.filter(c => c.published)
  // Also merge in any existing fetchCourses mock data that has published true (if any)
  // If your mock-data/courses.json exists and has published flag, we can merge it
  try {
    // try to read global 'courses' saved in localStorage (if earlier fetchCourses wrote them)
    const builtinRaw = localStorage.getItem('tm_builtin_courses') || '[]'
    const builtin = JSON.parse(builtinRaw)
    builtin.forEach(b => { if (b.published) published.push(b) })
  } catch (e) { 
    /* ignore */ 
    console.log(e);
  }

  return { data: published }
}

/**
 * Reject an application (sets status = 'REJECTED')
 */
export const rejectTrainerApplication = async (applicationId) => {
  await new Promise(r => setTimeout(r, 150))
  const raw = localStorage.getItem(TRAINER_APPS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  const idx = arr.findIndex(a => String(a.id) === String(applicationId))
  if (idx === -1) throw new Error('Application not found')
  arr[idx].status = 'REJECTED'
  arr[idx].rejectedAt = new Date().toISOString()
  localStorage.setItem(TRAINER_APPS_KEY, JSON.stringify(arr))
  logActivity(`Application rejected: ${arr[idx].email}`)
  return { data: arr[idx] }
}


/**
 * Delete a trainer application (completely remove)
 */
export const deleteTrainerApplication = async (applicationId) => {
  await new Promise(r => setTimeout(r, 150))
  const raw = localStorage.getItem(TRAINER_APPS_KEY)
  const arr = raw ? JSON.parse(raw) : []
  const idx = arr.findIndex(a => String(a.id) === String(applicationId))
  if (idx === -1) throw new Error('Application not found')
  const removed = arr.splice(idx, 1)[0]
  localStorage.setItem(TRAINER_APPS_KEY, JSON.stringify(arr))
  logActivity(`Application deleted: ${removed.email}`)
  return { data: removed }
}



export default api
