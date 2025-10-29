import React from 'react'

import courses from '../mock-data/courses.json'
import CourseList from '../component/domin/CourseList'

export default function Home(){
  return (
    <div>
      <section className="mb-8">
        <div className="bg-indigo-600 text-white rounded-lg p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learn new skills online</h1>
            <p className="mt-2 text-indigo-100 max-w-xl">Build your career with industry-aligned courses. Start small — prove big.</p>
          </div>
          <div>
            <button className="bg-white text-indigo-600 px-4 py-2 rounded shadow">Explore Courses</button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Courses</h2>
          <div className="text-sm text-gray-500">Showing {courses.length} courses</div>
        </div>

        {/* <CourseList courses={courses} /> */}
        <CourseList courses={courses} />
      </section>
    </div>
  )
}
