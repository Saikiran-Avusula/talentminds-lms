import React from 'react'
import { Link } from 'react-router-dom'
import imgReact from '../../Images/react for beginners.png'
import imgFull from '../../Images/full stack project with spring and react.png'
import imgSpring from '../../Images/Gemini_Generated_Image_bu5radbu5radbu5r.png'

function getCourseImage(course) {
  const title = (course?.title || '').toLowerCase()
  if (title.includes('spring boot')) return imgSpring
  if (title.includes('react for beginners')) return imgReact
  if (title.includes('full-stack') || title.includes('full stack')) return imgFull
  return null
}

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative w-full bg-gray-200 aspect-[16/9]">
        {(() => {
          const localImg = getCourseImage(course)
          const src = localImg || course.thumbnailUrl || null
          if (src) {
            return <img src={src} alt={course.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          }
          return <div className="absolute inset-0 w-full h-full flex items-center justify-center text-gray-500">No image</div>
        })()}
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
