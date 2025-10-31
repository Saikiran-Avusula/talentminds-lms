// frontend/src/component/landing/ExplorePreview.jsx
import React, { useEffect, useState } from 'react'
import { getPublishedCourses } from '../../services/api'
import { Link } from 'react-router-dom'

export default function ExplorePreview() {
  const [courses, setCourses] = useState([])
  useEffect(() => {
    let mounted = true
    getPublishedCourses().then(res => { if (mounted) setCourses(res.data || []) })
    return () => { mounted = false }
  }, [])

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Featured published courses</h3>
          <Link to="/explore" className="text-sm text-indigo-600">See all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.slice(0,6).map(c => (
            <div key={c.id} className="bg-white rounded p-4 border">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-gray-500 mt-1">{c.shortDescription}</div>
              <div className="mt-3 flex items-center justify-between">
                <Link to={`/course/${c.id}`} className="text-indigo-600 text-sm">View</Link>
                <div className="text-sm text-gray-500">{c.price ? `₹${c.price}` : 'Free'}</div>
              </div>
            </div>
          ))}
          {courses.length === 0 && <div className="text-gray-500">No published courses yet.</div>}
        </div>
      </div>
    </section>
  )
}
