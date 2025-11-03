// src/pages/trainer/TrainerDashboard.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getTrainerCourses } from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../../component/ui/ToastProvider'
import RoleProtectedRoute from '../../component/route/RoleProtectedRoute'
import MainLayout from '../../component/layout/MainLayout'

export default function TrainerDashboard() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getTrainerCourses(user.id)
        if (!mounted) return
        setCourses(res.data || [])
      } catch (err) {
        toast.showToast('Failed to load your courses')
        console.log(err);
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user) load()
    return () => { mounted = false }
  }, [user, toast])

  return (
    <RoleProtectedRoute requiredRole="TRAINER">
      <MainLayout>
        <div className="max-w-5xl mx-auto p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Trainer Dashboard</h2>
            <div className="w-full sm:w-auto">
              <button onClick={() => navigate('/trainer/new')} className="bg-indigo-600 text-white px-3 py-1 rounded">Create Course</button>
            </div>
          </div>

          <div className="mt-6">
            {loading ? <div className="text-gray-500">Loading...</div> : courses.length === 0 ? (
              <div className="text-gray-600">No courses yet. Create one to get started.</div>
            ) : (
              <div className="grid gap-4">
                {courses.map(c => (
                  <div key={c.id} className="border rounded p-4 bg-gray-50 flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-gray-600">{c.shortDescription}</div>
                      <div className="text-xs text-gray-400 mt-2">Status: {c.published ? 'Published' : 'Draft'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to={`/trainer/edit/${c.id}`} className="text-indigo-600 text-sm">Edit</Link>
                      <Link to={`/course/${c.id}/player`} className="text-sm text-gray-600">Preview</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </RoleProtectedRoute>
  )
}
