// src/pages/Explore.jsx
import React, { useEffect, useState } from 'react'
import { getPublishedCourses } from '../services/api'
import { Link } from 'react-router-dom'

export default function Explore() {
  const [groups, setGroups] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getPublishedCourses()
        const list = res.data || []
        const map = {}
        list.forEach(c => {
          const key = c.technology || (c.tags && c.tags[0]) || 'General'
          if (!map[key]) map[key] = []
          map[key].push(c)
        })
        if (!mounted) return
        setGroups(map)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Explore Courses</h1>

      {loading ? <div className="text-gray-500">Loading...</div> : (
        Object.keys(groups).length === 0 ? (
          <div className="text-gray-600">No published courses yet.</div>
        ) : (
          Object.entries(groups).map(([tech, list]) => (
            <section key={tech} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-medium">{tech}</h2>
                <div className="text-sm text-gray-500">{list.length} courses</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {list.map(c => (
                  <div key={c.id} className="border rounded p-4 bg-white">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{c.shortDescription}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <Link to={`/course/${c.id}`} className="text-indigo-600 text-sm">View</Link>
                      <div className="text-sm text-gray-500">{c.price ? `₹${c.price}` : 'Free'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )
      )}
    </div>
  )
}
