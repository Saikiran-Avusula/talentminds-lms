// frontend/src/component/landing/StickyCTA.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function StickyCTA() {
  return (
    <>
      <div className="fixed bottom-20 right-6 z-50 hidden md:block">
        <Link to="/auth/login" className="font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white bg-white text-indigo-600 shadow">
          Start Learning
        </Link>
      </div>

      {/* Small mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-indigo-600 text-white p-3 flex items-center justify-between">
          <div className="text-sm">Start learning now — free demo available</div>
          <Link to="/auth/login" className="font-bold border border-white rounded px-3 py-1 hover:bg-white hover:text-indigo-600">Sign in</Link>
        </div>
      </div>
    </>
  )
}
