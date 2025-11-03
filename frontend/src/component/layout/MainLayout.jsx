// src/component/layout/MainLayout.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import heroImg from '../../Images/full stack project with spring and react.png'
import { useLocation } from 'react-router-dom'

export default function MainLayout({ children }) {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const statsRef = useRef(null)
  const [counts, setCounts] = useState({ learners: 0, projects: 0, ready: 0 })
  const [countStarted, setCountStarted] = useState(false)

  const testimonials = useMemo(() => ([
    { id: 't1', quote: 'I landed interviews by showing my project repo.', author: 'Ananya, Learner' },
    { id: 't2', quote: 'The trainer feedback was practical and on-point.', author: 'Rahul, Learner' },
    { id: 't3', quote: 'Loved the full-stack flow from React to Spring.', author: 'Meera, Learner' },
  ]), [])

  useEffect(() => {
    if (!isHome) return
    const id = setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(id)
  }, [isHome, testimonials.length])

  useEffect(() => {
    if (!isHome || !statsRef.current || countStarted) return
    const el = statsRef.current
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setCountStarted(true)
        const start = performance.now()
        const duration = 1200
        const targets = { learners: 500, projects: 40, ready: 85 }
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration)
          setCounts({
            learners: Math.floor(targets.learners * p),
            projects: Math.floor(targets.projects * p),
            ready: Math.floor(targets.ready * p),
          })
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [isHome, countStarted])

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
              <div className="w-full h-56 md:h-64 lg:h-80 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                <img src={heroImg} alt="Full stack project preview" className="w-full h-full object-cover" loading="eager" />
              </div>
            </div>
          </div>

          {/* Features row */}
          <div className="bg-indigo-700">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 3v12" />
                    <path d="M18 9v12" />
                    <path d="M6 15l12-6" />
                  </svg>
                </div>
                <div className="text-lg font-semibold">Real Projects</div>
                <div className="text-sm text-indigo-200 mt-2">Build an app you can show to interviewers.</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                </div>
                <div className="text-lg font-semibold">Balanced Stack</div>
                <div className="text-sm text-indigo-200 mt-2">Frontend (React) + Backend (Java Spring Boot) + Database.</div>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-white/15 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h16v10H4z" />
                    <path d="M10 17l4-6 4 6" />
                  </svg>
                </div>
                <div className="text-lg font-semibold">Deploy Ready</div>
                <div className="text-sm text-indigo-200 mt-2">Host on Render, GCP or AWS with CI/CD.</div>
              </div>
            </div>
          </div>

          {/* Logos strip */}
          <div className="bg-white/10">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-indigo-100 text-sm mb-3">Trusted by learners from</div>
              <div className="relative overflow-hidden">
                <div className="animate-marquee gap-6">
                  {['TCS', 'Infosys', 'Wipro', 'Accenture', 'HCL', 'Cognizant', 'Capgemini', 'TechMahindra'].concat(['TCS', 'Infosys', 'Wipro', 'Accenture', 'HCL', 'Cognizant', 'Capgemini', 'TechMahindra']).map((name, i) => (
                    <div key={name + i} className="mx-3 inline-flex items-center justify-center bg-white/20 rounded px-3 py-2 text-center text-white text-sm font-medium transition-transform duration-150 hover:scale-105 hover:bg-white/30">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="bg-indigo-50 text-indigo-900">
            <div ref={statsRef} className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.learners.toLocaleString()}+</div>
                <div className="text-sm text-indigo-700">Learners</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.projects}+</div>
                <div className="text-sm text-indigo-700">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{counts.ready}%</div>
                <div className="text-sm text-indigo-700">Interview-ready</div>
              </div>
            </div>
          </div>

          {/* Testimonials carousel */}
          <div className="bg-white">
            <div className="container mx-auto px-4 py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What learners say</h3>
              <div className="relative max-w-3xl mx-auto">
                {testimonials.map((t, i) => (
                  <div key={t.id} className={`transition-opacity duration-500 ${activeTestimonial === i ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}>
                    <div className="rounded-lg border bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md">
                      <div className="text-gray-900 font-medium">“{t.quote}”</div>
                      <div className="text-sm text-gray-500 mt-2">— {t.author}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 mt-6 justify-center">
                  {testimonials.map((t, i) => (
                    <button key={t.id} onClick={() => setActiveTestimonial(i)} aria-label={`Go to testimonial ${i + 1}`} className={`h-2 w-2 rounded-full transition-transform duration-150 hover:scale-125 ${activeTestimonial === i ? 'bg-indigo-600' : 'bg-gray-300'}`}></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Trust badges */}
      {isHome && (
        <section className="bg-white">
          <div className="container mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">✓</span>Secure payments</div>
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">↺</span>Refund policy</div>
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">★</span>Industry mentors</div>
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs">⚡</span>Hands-on labs</div>
          </div>
        </section>
      )}

      {/* Secondary CTA band */}
      {isHome && (
        <section className="bg-indigo-600">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
            <div className="text-lg font-medium">Get started with a project today.</div>
            <a href="/explore" className="bg-white text-indigo-600 px-4 py-2 rounded shadow transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-lg">Explore Courses</a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
