import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoleProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) {
    // not logged in
    return <Navigate to="/auth/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // logged in but wrong role
    return <Navigate to="/" replace />
  }

  return children
}
