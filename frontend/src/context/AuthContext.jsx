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

// This AuthContext unifies demo-login + Firebase SSO and preserves a client-side role
// NOTE: For production, role must be stored & enforced server-side.

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('tm_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // get a fresh ID token (usable for backend verification)
          const idToken = await getIdToken(fbUser, /* forceRefresh */ true)
          setToken(idToken)
          setAuthToken(idToken)

          // read any previously-stored tm_user role (set by the login page or admin approvals)
          const rawSavedUser = localStorage.getItem('tm_user')
          const savedUser = rawSavedUser ? JSON.parse(rawSavedUser) : null
          const savedRole = savedUser?.role || null

          // check approved trainer list (if admin approved this email)
          const approvedRaw = localStorage.getItem('tm_approved_trainers')
          const approved = approvedRaw ? JSON.parse(approvedRaw) : []
          const isApprovedTrainer = fbUser.email && approved.includes(fbUser.email)

          const userObj = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email,
            email: fbUser.email,
            avatarUrl: fbUser.photoURL || null,
            provider: fbUser.providerData && fbUser.providerData[0]?.providerId,
            role: savedRole || (isApprovedTrainer ? 'TRAINER' : 'LEARNER'),
          }

          setUser(userObj)
          // persist minimal user info locally for UI
          localStorage.setItem('tm_user', JSON.stringify(userObj))
        } else {
          // not signed in
          setToken(null)
          setUser(null)
          setAuthToken(null)
          localStorage.removeItem('tm_user')
          localStorage.removeItem('tm_token')
        }
      } catch (err) {
        console.error('AuthState error', err)
        setToken(null)
        setUser(null)
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // keep token in axios defaults if token changes
  useEffect(() => {
    if (token) setAuthToken(token)
  }, [token])

  // Demo/email login (client-side mock) — accepts user object that includes role if desired
  const login = async ({ token: newToken, user: userObj }) => {
    setLoading(true)
    try {
      setToken(newToken)
      setUser(userObj)
      setAuthToken(newToken)
      localStorage.setItem('tm_user', JSON.stringify(userObj))
      // store token as well (useful for demo flows)
      localStorage.setItem('tm_token', newToken)
    } finally {
      setLoading(false)
    }
  }

  // Google SSO popup (delegates to Firebase)
  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged handles the rest (token + user)
      return result
    } finally {
      setLoading(false)
    }
  }

  // logout: sign out from firebase (if applicable) and clear local storage
  const logout = async () => {
    try {
      await fbSignOut(auth)
    } catch (e) {
      // ignore if not firebase user
      console.error('Firebase signOut error', e)
    }
    setToken(null)
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem('tm_user')
    localStorage.removeItem('tm_token')
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
