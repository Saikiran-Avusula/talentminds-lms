import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/') // go to homepage after logout
  }

  // Render avatar: use avatarUrl if exists, otherwise initials
  const Avatar = ({ user }) => {
    const initials = (user?.name || 'U').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
    if (user?.avatarUrl) {
      return (
        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
      )
    }
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
        {initials}
      </div>
    )
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">TalentMinds</Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hidden sm:inline-block text-sm text-gray-700 hover:text-indigo-600">Courses</Link>

          {/* If not logged in, show Sign in */}
          {!user && (
            <>
              <Link to="/auth/login" className="text-sm text-gray-700 hover:text-indigo-600">Sign in</Link>
            </>
          )}

          {/* When logged in, show user avatar + dropdown */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 focus:outline-none"
                aria-expanded={open}
                aria-haspopup="true"
              >
                <Avatar user={user} />
                <span className="hidden sm:inline-block text-sm text-gray-700">{user.name}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12.998l-4.25 4.65a.75.75 0 01-1.12 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                  <div className="py-1">
                    <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                    <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
