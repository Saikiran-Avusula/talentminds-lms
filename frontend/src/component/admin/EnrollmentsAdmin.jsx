import React, { useEffect, useState } from 'react'
import { getAllEnrollmentsAdmin, revokeEnrollmentAdmin } from '../../services/api'
import { useToast } from '../ui/ToastProvider'
import { exportToCsv } from '../../utils/csv'

export default function EnrollmentsAdmin() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getAllEnrollmentsAdmin()
      setEnrollments(res.data || [])
    } catch (err) {
      toast.showToast('Failed to load enrollments')
      console.error(err)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const revoke = async (id) => {
    try {
      await revokeEnrollmentAdmin(id)
      toast.showToast('Enrollment revoked')
      await load()
    } catch (err) {
      toast.showToast('Revoke failed')
        console.error(err)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Enrollments</h3>
        <div className="flex gap-2">
          <button onClick={() => exportToCsv('enrollments.csv', enrollments)} className="text-sm px-2 py-1 border rounded">Export CSV</button>
          <button onClick={load} className="text-sm px-2 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="space-y-2">
          {enrollments.map(e => (
            <div key={e.id} className="p-3 border rounded flex justify-between items-start">
              <div>
                <div className="font-semibold">{e.courseTitle}</div>
                <div className="text-sm text-gray-600">Enrolled: {new Date(e.enrolledAt).toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">Progress: {e.progressPercent}%</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => revoke(e.id)} className="px-3 py-1 border rounded text-sm text-red-600">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
