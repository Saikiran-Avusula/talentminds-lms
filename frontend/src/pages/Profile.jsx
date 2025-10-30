// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../component/ui/ToastProvider'
import MainLayout from '../component/layout/MainLayout'
import ProtectedRoute from '../component/route/ProtectedRoute'

export default function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', avatarUrl: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', avatarUrl: user.avatarUrl || '', bio: user.bio || '' })
    }
  }, [user])

  const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = async () => {
    setLoading(true)
    try {
      const updated = { ...user, ...form }
      localStorage.setItem('tm_user', JSON.stringify(updated))
      await login({ token: localStorage.getItem('tm_token') || 'demo-token', user: updated })
      toast.showToast('Profile updated', { type: 'success' })
    } catch (err) {
      toast.showToast('Save failed', { type: 'error' })
        console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input value={form.name} onChange={e => change('name', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Email (readonly)</label>
              <input value={form.email} readOnly className="w-full border rounded px-3 py-2 mt-1 bg-gray-50" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Avatar URL</label>
              <input value={form.avatarUrl} onChange={e => change('avatarUrl', e.target.value)} className="w-full border rounded px-3 py-2 mt-1" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Bio</label>
              <textarea value={form.bio} onChange={e => change('bio', e.target.value)} rows={4} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save profile'}</button>
              <button onClick={() => window.history.back()} className="text-sm text-gray-600">Back</button>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
