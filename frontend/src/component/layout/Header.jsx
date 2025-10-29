import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">TalentMinds</Link>

        <nav className="space-x-4 hidden sm:flex">
          <Link to="/" className="text-sm text-gray-700 hover:text-indigo-600">Courses</Link>
          <a href="#" className="text-sm text-gray-700 hover:text-indigo-600">About</a>
          <a href="#" className="text-sm text-gray-700 hover:text-indigo-600">Login</a>
        </nav>

        <div className="sm:hidden">
          {/* simple mobile menu placeholder */}
          <button aria-label="open menu" className="text-gray-700">☰</button>
        </div>
      </div>
    </header>
  )
}
