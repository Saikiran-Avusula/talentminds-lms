// src/pages/trainer/TrainerDashboard.jsx
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getTrainerCourses } from '../../services/api'

export default function TrainerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (!user) {
      setCourses([])
      setLoading(false)
      return
    }
    getTrainerCourses(user.id).then(res => {
      if (mounted) setCourses(res.data || [])
    }).catch(() => {
      if (mounted) setCourses([])
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [user])

  const goCreate = () => navigate('/trainer/new')

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Trainer Dashboard</h2>
        <div>
          <button onClick={goCreate} className="bg-indigo-600 text-white px-3 py-1 rounded">Create course</button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-600">You have not created any courses yet.</div>
        ) : (
          <div className="grid gap-4">
            {courses.map(c => (
              <div key={c.id} className="border rounded p-4 flex justify-between items-start bg-gray-50">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-gray-600">{c.shortDescription}</div>
                  <div className="text-sm text-gray-500 mt-2">Status: {c.published ? 'Published' : 'Draft'}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/trainer/edit/${c.id}`} className="text-indigo-600 text-sm">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
