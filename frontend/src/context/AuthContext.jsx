// /* eslint-disable react-refresh/only-export-components */
// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { setAuthToken } from '../services/api'

// const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(() => localStorage.getItem('tm_token') || null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (token) {
//       setAuthToken(token)
//       const raw = localStorage.getItem('tm_user')
//       if (raw) setUser(JSON.parse(raw))
//       else setUser({ id: 1, name: 'Demo User', email: 'demo@example.com', role: 'LEARNER' })
//     } else {
//       setUser(null)
//       setAuthToken(null)
//     }
//   }, [token])

//   const login = async ({ token: newToken, user: userObj }) => {
//     setLoading(true)
//     try {
//       setToken(newToken)
//       localStorage.setItem('tm_user', JSON.stringify(userObj || { name: 'Demo User' }))
//       setUser(userObj || { name: 'Demo User' })
//       setAuthToken(newToken)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const logout = () => {
//     setToken(null)
//     setUser(null)
//     localStorage.removeItem('tm_user')
//     setAuthToken(null)
//   }

//   return (
//     <AuthContext.Provider value={{ user, token, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   return useContext(AuthContext)
// }



// src/context/AuthContext.jsx with firebase auth integration

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'
import { auth, googleProvider } from '../firebase/firebaseConfig'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  getIdToken,
} from 'firebase/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('tm_token') || null)
  const [loading, setLoading] = useState(true)

  // Observe Firebase auth state — keeps user in sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Get ID token to send to backend
        const idToken = await getIdToken(fbUser, /* forceRefresh */ true)
        setToken(idToken)
        setAuthToken(idToken)
        // minimal user shape — you can expand with fbUser.displayName, photoURL
        const userObj = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email,
          email: fbUser.email,
          avatarUrl: fbUser.photoURL || null,
          provider: fbUser.providerData && fbUser.providerData[0]?.providerId,
        }
        setUser(userObj)
        localStorage.setItem('tm_user', JSON.stringify(userObj))
      } else {
        // Not signed in
        setToken(null)
        setUser(null)
        setAuthToken(null)
        localStorage.removeItem('tm_user')
        localStorage.removeItem('tm_token')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Keep local token state in sync (e.g., demo login)
  useEffect(() => {
    if (token) {
      setAuthToken(token)
    }
  }, [token])

  // Demo / email login (keeps old behavior)
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

  // Sign-in with Google (popup)
  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged listener will handle token and user state
      return result
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // If user signed in via Firebase, sign out from Firebase
    try {
      await fbSignOut(auth)
    } catch (e) {
      // ignore if not a firebase user - just clear local state
      if (e.code !== 'auth/user-not-found') throw e
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('tm_user')
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
