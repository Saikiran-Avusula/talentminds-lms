import React, { useEffect, useState } from 'react'
// import CourseList from '../component/domain/CourseList'
import CourseList from '../component/domin/CourseList'
import { fetchCourses } from '../services/api'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetchCourses().then(res => {
      if (mounted) setCourses(res.data || [])
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <section id="courses" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured courses</h2>
          <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${courses.length} courses`}</div>
        </div>

        <div>
          <CourseList courses={courses} />
        </div>
      </section>

      <section className="mt-12 bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-3">Why TalentMinds?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-semibold">Project-first curriculum</div>
            <div className="text-sm text-gray-600">Build real apps to show in interviews.</div>
          </div>

          <div>
            <div className="font-semibold">Balanced frontend & backend</div>
            <div className="text-sm text-gray-600">Java + Spring Boot for backend; React + Vite + Tailwind for frontend.</div>
          </div>

          <div>
            <div className="font-semibold">Deploy-ready</div>
            <div className="text-sm text-gray-600">Prepare for hosting on Render / GCP / AWS and CI pipelines.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
