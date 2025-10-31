// frontend/src/component/landing/HeroMarketing.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function HeroMarketing() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">Build interview-ready skills with real projects</h1>
          <p className="mt-4 text-lg max-w-xl">Hands-on Java + Spring Boot and React projects, step-by-step learning paths, and deploy-ready portfolios to show at interviews.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/explore" className="font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white bg-white text-indigo-600">Explore Courses</Link>
            <Link to="/auth/login" className="font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white text-white bg-transparent">Sign in</Link>
          </div>

          <div className="mt-6 text-sm text-indigo-100">
            <strong>Free demo:</strong> Try the student dashboard and course player — no credit card.
          </div>
        </div>

        <div className="flex items-center justify-center">
          {/* Placeholder illustration / GIF */}
          <div className="w-full max-w-md h-64 bg-white/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="font-semibold text-lg">Interactive Dashboard Demo</div>
              <div className="text-xs text-indigo-100 mt-2">Click-through preview or GIF goes here</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
