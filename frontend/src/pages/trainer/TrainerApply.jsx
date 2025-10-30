// src/pages/trainer/TrainerApply.jsx
import React, { useState } from 'react'
import { submitTrainerApplication } from '../../services/api'
import { useToast } from '../../component/ui/ToastProvider'
import { useAuth } from '../../context/AuthContext'

export default function TrainerApply() {
  const { user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    portfolioUrl: ''
  })
  const [loading, setLoading] = useState(false)

  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email) return toast.showToast('Please provide name and email')
    setLoading(true)
    try {
      await submitTrainerApplication(form)
      toast.showToast('Application submitted — admin will review it.')
      setForm({ name: form.name, email: form.email, bio: '', portfolioUrl: '' })
    } catch (err) {
      toast.showToast('Submit failed: ' + (err?.message || ''))
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Apply to become a Trainer</h2>
        <p className="text-sm text-gray-600 mb-4">Fill the short form and our admin will review your application.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input value={form.name} onChange={e => change('name', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input value={form.email} onChange={e => change('email', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Short bio / expertise</label>
            <textarea value={form.bio} onChange={e => change('bio', e.target.value)} rows={3} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Portfolio / website (optional)</label>
            <input value={form.portfolioUrl} onChange={e => change('portfolioUrl', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" placeholder="https://..." />
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? 'Submitting...' : 'Submit application'}</button>
            <div className="text-sm text-gray-500">After approval, you'll get trainer access and can create courses.</div>
          </div>
        </form>
      </div>
  )
}
