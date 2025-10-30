// src/component/admin/ApplicationsAdmin.jsx
import React, { useEffect, useState } from 'react'
import { getTrainerApplications, approveTrainerApplication, rejectTrainerApplication } from '../../services/api'
import { useToast } from '../ui/ToastProvider'

export default function ApplicationsAdmin() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getTrainerApplications()
      setApps(res.data || [])
    } catch (err) {
      toast.showToast('Failed to load applications', { type: 'error' })
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    try {
      await approveTrainerApplication(id)
      toast.showToast('Approved', { type: 'success' })
      await load()
    } catch (err) {
      toast.showToast('Approve failed', { type: 'error' })
      console.log(err);
    }
  }

  const decline = async (id) => {
    if (!confirm('Are you sure you want to decline this application?')) return
    try {
      await rejectTrainerApplication(id)
      toast.showToast('Application declined', { type: 'info' })
      await load()
    } catch (err) {
      toast.showToast('Decline failed', { type: 'error' })
      console.log(err);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Trainer Applications</h3>
        <div className="text-sm text-gray-500">{apps.length} apps</div>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="space-y-2">
          {apps.map(a => (
            <div key={a.id} className="p-3 border rounded flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold">{a.name} <span className="text-sm text-gray-500">({a.email})</span></div>
                <div className="text-sm text-gray-600 mt-1">{a.bio}</div>
                {a.portfolioUrl && <div className="text-sm text-indigo-600 mt-2"><a href={a.portfolioUrl} target="_blank" rel="noreferrer">{a.portfolioUrl}</a></div>}
                <div className="text-xs text-gray-400 mt-2">Submitted: {new Date(a.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="text-sm">Status: <span className="font-medium">{a.status}</span></div>
                <div className="flex gap-2">
                  {a.status !== 'APPROVED' && <button onClick={() => approve(a.id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>}
                  {a.status === 'PENDING' && <button onClick={() => decline(a.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm border border-red-200">Decline</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
