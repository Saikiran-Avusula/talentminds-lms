// src/pages/trainer/CourseEditor.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createCourseDraft, getTrainerCourses } from '../../services/api'
import ModuleEditor  from '../../component/domin/ModuleEditor'
import { useToast } from '../../component/ui/ToastProvider'
import RoleProtectedRoute from '../../component/route/RoleProtectedRoute'
import MainLayout from '../../component/layout/MainLayout'

const emptyCourse = {
  title: '',
  shortDescription: '',
  description: '',
  price: 0,
  modules: []
}

export default function CourseEditor() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(emptyCourse)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    if (!id) return
    (async () => {
      try {
        const res = await getTrainerCourses(user.id)
        if (!mounted) return
        const found = (res.data || []).find(c => String(c.id) === String(id))
        if (found) setCourse(found)
      } catch (err) {
        toast.showToast('Failed to load draft')
        console.log(err);
      }
    })()
    return () => { mounted = false }
  }, [id, user, toast])

  const handleChange = (field, val) => setCourse(prev => ({ ...prev, [field]: val }))

  const addModule = () => setCourse(prev => ({ ...prev, modules: [...(prev.modules || []), { id: Date.now(), title:'', description:'', contentUrl:'' }] }))

  const updateModule = (moduleId, patch) => setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...patch } : m) }))

  const removeModule = (moduleId) => setCourse(prev => ({ ...prev, modules: prev.modules.filter(m => m.id !== moduleId) }))

  const handleSave = async () => {
    if (!user) return toast.showToast('Sign in as trainer to save')
    if (!course.title) return toast.showToast('Please enter a title')
    setLoading(true)
    try {
      const payload = { ...course }
      const res = await createCourseDraft(user.id, payload)
      toast.showToast('Saved draft successfully')
      navigate(`/trainer/course/${res.data.id}`)
    } catch (err) {
      toast.showToast('Save failed: ' + (err?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleProtectedRoute requiredRole="TRAINER">
      <MainLayout>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{id ? 'Edit Course' : 'Create Course'}</h2>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white px-3 py-1 rounded">{loading ? 'Saving...' : 'Save'}</button>
              <button onClick={() => navigate('/trainer')} className="text-sm text-gray-600">Cancel</button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Title</label>
              <input value={course.title} onChange={e => handleChange('title', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Short description</label>
              <input value={course.shortDescription} onChange={e => handleChange('shortDescription', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Full description</label>
              <textarea value={course.description} onChange={e => handleChange('description', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" rows={4} />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Price (INR)</label>
              <input type="number" value={course.price} onChange={e => handleChange('price', Number(e.target.value))} className="w-48 border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Modules</h3>
                <button onClick={addModule} className="text-sm bg-white border px-2 py-1 rounded">Add module</button>
              </div>

              <div className="space-y-3">
                {(course.modules || []).map(m => (
                  <ModuleEditor key={m.id} module={m} onChange={updateModule} onRemove={() => removeModule(m.id)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </RoleProtectedRoute>
  )
}
