// src/component/layout/MainLayout.jsx
import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useLocation } from 'react-router-dom'

export default function MainLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {isHome && (
        <section className="bg-indigo-600 text-white">
          <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-8">
            <div className="md:flex-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Build industry-ready skills</h1>
              <p className="mt-4 text-lg max-w-xl">Project-based courses in Java, Spring Boot and React — build a portfolio and get interview-ready.</p>
              <div className="mt-6 flex gap-3">
                <a href="/explore" className="bg-white text-indigo-600 px-4 py-2 rounded shadow">Explore Courses</a>
                <a href="/auth/login" className="border border-white text-white px-4 py-2 rounded">Sign in</a>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="w-full h-64 bg-white rounded-lg flex items-center justify-center text-indigo-600">
                <div className="text-center">
                  <div className="text-2xl font-semibold">Live Project Demo</div>
                  <div className="text-sm text-gray-600 mt-2">Preview student dashboard & course player</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features row */}
          <div className="bg-indigo-700">
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-lg font-semibold">Real Projects</div>
                <div className="text-sm text-indigo-200 mt-2">Build an app you can show to interviewers.</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">Balanced Stack</div>
                <div className="text-sm text-indigo-200 mt-2">Frontend (React) + Backend (Java Spring Boot) + Database.</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">Deploy Ready</div>
                <div className="text-sm text-indigo-200 mt-2">Host on Render, GCP or AWS with CI/CD.</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <Footer />
    </div>
  )
}
