// src/pages/trainer/CourseEditor.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createCourseDraft, getTrainerCourses } from '../../services/api'
import { useToast } from '../../component/ui/ToastProvider'
import ModuleEditor from '../../component/domin/ModuleEditor'

const emptyCourse = {
  title: '',
  shortDescription: '',
  description: '',
  price: 0,
  modules: []
}

export default function CourseEditor() {
  const { id } = useParams() // optional course id for edit
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [course, setCourse] = useState(emptyCourse)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    if (!id) return
    // load trainer courses and find the one to edit (localStorage mock)
    getTrainerCourses(user.id).then(res => {
      if (!mounted) return
      const found = (res.data || []).find(c => String(c.id) === String(id))
      if (found) setCourse(found)
    }).catch(()=>{})

    return () => { mounted = false }
  }, [id, user])

  const handleChange = (field, val) => setCourse(prev => ({ ...prev, [field]: val }))

  const addModule = () => {
    setCourse(prev => ({ ...prev, modules: [...(prev.modules || []), { id: Date.now(), title: '', description: '', contentUrl: '' }] }))
  }

  const updateModule = (moduleId, update) => {
    setCourse(prev => ({ ...prev, modules: prev.modules.map(m => m.id === moduleId ? { ...m, ...update } : m) }))
  }

  const removeModule = (moduleId) => {
    setCourse(prev => ({ ...prev, modules: prev.modules.filter(m => m.id !== moduleId) }))
  }

  const handleSave = async () => {
    if (!user) return toast.showToast('You must be signed in as trainer')
    if (!course.title) return toast.showToast('Please enter a title')
    setLoading(true)
    try {
      const payload = { ...course }
      const res = await createCourseDraft(user.id, payload)
      toast.showToast('Saved draft')
      // navigate to trainer dashboard or edit page
      navigate(`/trainer/course/${res.data.id}`)
    } catch (err) {
      toast.showToast('Save failed: ' + (err?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
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
  )
}


