// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMyEnrollments } from '../services/api'
import { Link } from 'react-router-dom'


export default function Dashboard() {
  const { user, logout } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getMyEnrollments().then(res => {
      if (mounted) setEnrollments(res.data || [])
    }).catch(() => {
      if (mounted) setEnrollments([])
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Hi, <span className="font-medium">{user?.name || 'User'}</span></div>
          <button onClick={logout} className="text-sm text-red-600">Sign out</button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">My Courses</h3>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : enrollments.length === 0 ? (
          <div className="text-gray-600">You have not enrolled in any courses yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrollments.map(e => (
              <div key={e.id} className="border rounded p-4 bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-12 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    IMG
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-gray-500">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">Progress: {e.progressPercent ?? 0}%</div>
                      <div className="mt-3">
                        <Link to={`/course/${e.courseId}`} className="text-indigo-600 text-sm">Open course</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
