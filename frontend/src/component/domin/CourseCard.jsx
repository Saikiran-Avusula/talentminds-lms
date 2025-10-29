import React from 'react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="w-full h-40 bg-gray-200">
        {/* use external thumbnail or fallback color block */}
        {course.thumbnailUrl
          ? <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover" />
          : <div className="w-full h-40 flex items-center justify-center text-gray-500">No image</div>
        }
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{course.shortDescription}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">By {course.trainerName || 'Trainer'}</div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-indigo-600">{course.price ? `₹${course.price}` : 'Free'}</div>
            <Link to={`/course/${course.id}`} className="text-sm text-indigo-600 border border-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-600 hover:text-white transition-colors">View</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
