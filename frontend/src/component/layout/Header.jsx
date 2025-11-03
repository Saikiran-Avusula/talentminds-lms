// src/component/layout/Header.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../ui/ToastProvider'

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileRef = useRef(null)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
      if (mobileRef.current && !mobileRef.current.contains(e.target) && !e.target.closest('#tm-hamburger')) {
        setMobileOpen(false)
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    try {
      await logout()
      toast.showToast('Signed out', { type: 'info' })
      navigate('/')
    } catch (err) {
      toast.showToast('Sign out failed', { type: 'error' })
      console.log(err);
    } finally {
      setOpen(false)
      setMobileOpen(false)
    }
  }

  // role-specific links
  const getRoleLinks = () => {
    if (user?.role === 'ADMIN') {
      return [
        { to: '/admin', label: 'Admin' },
        { to: '/admin/site-controls', label: 'Site Controls' }
      ]
    }
    if (user?.role === 'TRAINER') {
      return [
        { to: '/trainer', label: 'Trainer Dashboard' },
        { to: '/trainer/new', label: 'Create Course' },
        { to: '/trainer/profile', label: 'Profile' } // trainer profile in main nav, not in avatar dropdown
      ]
    }
    return [
      { to: '/explore', label: 'Explore' },
      { to: '/trainer/apply', label: 'Apply as Trainer' }
    ]
  }

  const roleLinks = getRoleLinks()

  return (
    <header className="bg-white sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">TalentMinds</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {roleLinks.map(l => (
              <Link key={l.to} to={l.to} className="text-base text-gray-700 hover:text-indigo-600 font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors duration-150">{l.label}</Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!user && <div className="hidden md:block"><Link to="/auth/login" className="text-base text-gray-700 hover:text-indigo-600 font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors duration-150">Sign in</Link></div>}

          {user && (
            <div className="hidden md:flex items-center gap-3" ref={menuRef}>
              <div className="relative">
                <button onClick={() => setOpen(s => !s)} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                    {(user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-base text-gray-700">{user.name}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12.998l-4.25 4.65a.75.75 0 01-1.12 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                    <div className="py-1">
                      {/* Only show Dashboard for learners in avatar dropdown */}
                      {user.role === 'LEARNER' && <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50">Dashboard</Link>}
                      {/* Profile link removed for Admin and Trainer in avatar dropdown */}
                      {user.role === 'LEARNER' && <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-50">Profile</Link>}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-gray-50">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="md:hidden">
            <button
              id="tm-hamburger"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen ? 'true' : 'false'}
              onClick={() => setMobileOpen(s => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: slide from LEFT */}
      <div
        ref={mobileRef}
        className={`md:hidden fixed inset-0 z-40 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`}
        aria-hidden={!mobileOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

        <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-lg font-bold text-indigo-600">TalentMinds</Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Close mobile menu" className="p-2 rounded hover:bg-gray-100">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">{(user.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {roleLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 text-base text-gray-700">{l.label}</Link>
            ))}

            <Link to="/explore" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 text-base text-gray-700">Explore</Link>

            {user && (
              <>
                {/* only learners have dashboard in mobile menu */}
                {user.role === 'LEARNER' && <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 text-base text-gray-700">Dashboard</Link>}
                {/* Profile is available to Learners via /profile; Trainers access profile via main nav */}
                {user.role === 'LEARNER' && <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 text-base text-gray-700">Profile</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-red-600">Logout</button>
              </>
            )}

            {!user && <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-gray-50 text-base text-gray-700">Sign in</Link>}
          </nav>

          <div className="mt-6 text-xs text-gray-400">
            © {new Date().getFullYear()} TalentMinds
          </div>
        </div>
      </div>
    </header>
  )
}
