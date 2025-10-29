/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('tm_token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      // In a real app, call GET /api/auth/me to fetch user info.
      // For now we simulate a logged-in user object persisted in localStorage.
      const raw = localStorage.getItem('tm_user')
      if (raw) setUser(JSON.parse(raw))
      else setUser({ id: 1, name: 'Demo User', email: 'demo@example.com', role: 'LEARNER' })
    } else {
      setUser(null)
      setAuthToken(null)
    }
  }, [token])

  const login = async ({ token: newToken, user: userObj }) => {
    setLoading(true)
    try {
      setToken(newToken)
      localStorage.setItem('tm_user', JSON.stringify(userObj || { name: 'Demo User' }))
      setUser(userObj || { name: 'Demo User' })
      setAuthToken(newToken)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('tm_user')
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
