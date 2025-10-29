// src/pages/Dashboard.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button onClick={logout} className="text-sm text-red-600">Sign out</button>
      </div>

      <div className="mt-4 text-gray-700">
        <p>Welcome, <span className="font-medium">{user?.name || 'User'}</span></p>
        <p className="mt-2 text-sm">This is a protected area — later we will show enrolled courses and progress.</p>
      </div>
    </div>
  )
}
