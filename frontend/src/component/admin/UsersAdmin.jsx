// src/component/admin/UsersAdmin.jsx
import React, { useEffect, useState } from 'react'
import { getAllUsers, updateUserRole } from '../../services/api'
import { useToast } from '../ui/ToastProvider'
import { exportToCsv } from '../../utils/csv'

export default function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getAllUsers()
        if (!mounted) return
        setUsers(res.data || [])
      } catch (err) {
        toast.showToast('Failed to load users')
        console.log(err);
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
    // NOTE: empty deps so this runs once on mount only
  }, [toast])

  const promote = async (email, role) => {
    try {
      await updateUserRole(email, role)
      toast.showToast(`Set role ${role} for ${email}`)
      // update users locally without re-fetching entire list (safe)
      setUsers(prev => prev.map(u => (u.email === email ? { ...u, role } : u)))
    } catch (err) {
      toast.showToast('Role update failed')
      console.log(err);
    }
  }

  const filtered = users.filter(u => (u.name||'').toLowerCase().includes(q.toLowerCase()) || (u.email||'').toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Users</h3>
        <div className="flex gap-2">
          <button onClick={() => exportToCsv('users.csv', users)} className="text-sm px-2 py-1 border rounded">Export CSV</button>
        </div>
      </div>

      <div className="mb-3 flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search users" className="border px-2 py-1 rounded w-full" />
        <button onClick={() => { /* just re-run effect: simple reload approach */ window.location.reload() }} className="px-2 py-1 border rounded">Refresh</button>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.email} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Role: <span className="font-medium">{u.role}</span></div>
                <select value={u.role} onChange={(e) => promote(u.email, e.target.value)} className="border px-2 py-1 rounded">
                  <option value="LEARNER">LEARNER</option>
                  <option value="TRAINER">TRAINER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
