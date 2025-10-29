// src/pages/CourseDetail.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourseById, enrollCourse } from '../services/api'
import courses from '../mock-data/courses.json' // used as fallback/sync

function ModuleList({ modules }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="mt-4 space-y-3">
      {modules.map((m, idx) => (
        <div key={m.id} className="border rounded">
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full text-left p-3 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{m.title}</div>
              <div className="text-sm text-gray-500">Lesson {idx + 1}</div>
            </div>
            <div className="text-gray-400">{openIndex === idx ? '−' : '+'}</div>
          </button>

          {openIndex === idx && (
            <div className="p-3 bg-white text-gray-700 border-t">
              <p>{m.description || 'This lesson contains video and reading materials.'}</p>
              {m.contentUrl && (
                <div className="mt-2">
                  <a href={m.contentUrl} target="_blank" rel="noreferrer" className="text-indigo-600">Open resource</a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState(() => courses.find(c => String(c.id) === String(id)) || courses[0])

  // Optionally fetch fresh course (mock) — safe to ignore if fetch fails
  React.useEffect(() => {
    let mounted = true
    fetchCourseById(id).then(res => {
      if (mounted && res?.data) setCourse(res.data)
    }).catch(()=>{})
    return () => { mounted = false }
  }, [id])

  const handleEnroll = async () => {
    const ok = window.confirm('Do you want to enroll in this course?')
    if (!ok) return
    setLoading(true)
    try {
      const res = await enrollCourse(course.id)
      // res.data contains enrollment or message
      if (res?.data?.message === 'already enrolled') {
        alert('You are already enrolled in this course.')
      } else {
        alert('Enrolled successfully! You can view this course in Dashboard.')
        navigate('/dashboard')
      }
    } catch (err) {
      console.error(err)
      alert('Enrollment failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded shadow p-6">
        <div className="md:flex md:gap-8">
          <div className="md:flex-1">
            <img src={course.thumbnailUrl || 'https://via.placeholder.com/800x300?text=Course+Banner'} alt={course.title} className="w-full h-56 object-cover rounded" />
            <h1 className="text-2xl font-bold mt-4">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Curriculum</h3>
              <ModuleList modules={course.modules || []} />
            </div>
          </div>

          <aside className="mt-6 md:mt-0 md:w-80">
            <div className="border rounded p-4 bg-gray-50">
              <div className="text-sm text-gray-600">Trainer</div>
              <div className="font-medium mt-1">{course.trainerName || 'Trainer'}</div>

              <div className="mt-4">
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-xl font-bold text-indigo-600 mt-1">{course.price ? `₹${course.price}` : 'Free'}</div>
              </div>

              <button
                onClick={handleEnroll}
                disabled={loading}
                className="mt-6 w-full bg-indigo-600 text-white py-2 rounded shadow hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
