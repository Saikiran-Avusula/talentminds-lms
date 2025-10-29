// src/components/route/ProtectedRoute.jsx

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    // redirect to login, preserve original location with state if you want
    return <Navigate to="/auth/login" replace />
  }
  return children
}
