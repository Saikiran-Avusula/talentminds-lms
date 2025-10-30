import React, { useEffect, useState } from 'react'
import { getAllCoursesAdmin, publishCourse, unpublishCourse, deleteCourseAdmin } from '../../services/api'
import { useToast } from '../ui/ToastProvider'
import { exportToCsv } from '../../utils/csv'

export default function CoursesAdmin() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await getAllCoursesAdmin()
      setCourses(res.data || [])
    } catch (err) {
      toast.showToast('Failed to load courses')
        console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const doPublish = async (id) => {
    try {
      await publishCourse(id)
      toast.showToast('Published')
      await load()
    } catch (err) { toast.showToast('Publish failed') 
        console.error(err)
    }
        
  }

  const doUnpublish = async (id) => {
    try {
      await unpublishCourse(id)
      toast.showToast('Unpublished')
      await load()
    } catch (err) { toast.showToast('Unpublish failed') 
        console.error(err)
    }
  }

  const doDelete = async (id) => {
    if (!confirm('Delete this course permanently?')) return
    try {
      await deleteCourseAdmin(id)
      toast.showToast('Deleted')
      await load()
    } catch (err) { toast.showToast('Delete failed') 
        console.error(err)
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Courses</h3>
        <div className="flex gap-2">
          <button onClick={() => exportToCsv('courses.csv', courses)} className="text-sm px-2 py-1 border rounded">Export CSV</button>
          <button onClick={load} className="text-sm px-2 py-1 border rounded">Refresh</button>
        </div>
      </div>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        <div className="space-y-2">
          {courses.map(c => (
            <div key={c.id} className="p-3 border rounded flex justify-between items-start">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-600">{c.shortDescription}</div>
                <div className="text-xs text-gray-400 mt-2">By: {c.trainerId} • {c.published ? 'Published' : 'Draft'}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {c.published ? (
                  <button onClick={() => doUnpublish(c.id)} className="px-3 py-1 border rounded text-sm">Unpublish</button>
                ) : (
                  <button onClick={() => doPublish(c.id)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Publish</button>
                )}
                <button onClick={() => doDelete(c.id)} className="px-3 py-1 border rounded text-sm text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
