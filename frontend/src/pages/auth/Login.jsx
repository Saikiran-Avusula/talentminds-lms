// src/pages/auth/Login.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [role, setRole] = useState('LEARNER') // LEARNER | TRAINER | ADMIN

  const { user, loading: authLoading, login, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo || (role === 'ADMIN' ? '/admin' : (role === 'TRAINER' ? '/trainer' : '/dashboard'))

  useEffect(() => {
    if (authLoading) return
    if (user) {
      const dest = user.role === 'ADMIN' ? '/admin' : (user.role === 'TRAINER' ? '/trainer' : '/dashboard')
      navigate(location.state?.returnTo || dest, { replace: true })
    }
  }, [user, authLoading, navigate, location.state])

  const setLocalRoleForNextSignIn = (roleToSave) => {
    const raw = localStorage.getItem('tm_user')
    const curr = raw ? JSON.parse(raw) : {}
    curr.role = roleToSave
    localStorage.setItem('tm_user', JSON.stringify(curr))
  }

  const handleAdminLogin = async (e) => {
    e?.preventDefault()
    setError(null)
    const username = email?.trim()
    const pwd = password?.trim()
    if (username === 'admin' && pwd === 'admin') {
      const fakeToken = 'demo-admin-token-' + Math.random().toString(36).slice(2)
      const adminUser = { id: 'admin-1', name: 'Admin', email: 'admin@example.com', role: 'ADMIN' }
      localStorage.setItem('tm_user', JSON.stringify(adminUser))
      localStorage.setItem('tm_token', fakeToken)
      await login({ token: fakeToken, user: adminUser })
      navigate(returnTo, { replace: true })
    } else {
      setError('Invalid admin credentials. Use admin / admin')
    }
  }

  const handleLearnerDemo = async (e) => {
    e?.preventDefault()
    setError(null)
    try {
      const fakeToken = 'demo-token-' + Math.random().toString(36).slice(2)
      const userObj = { id: Date.now(), name: email || 'Learner', email, role: 'LEARNER' }
      localStorage.setItem('tm_user', JSON.stringify(userObj))
      localStorage.setItem('tm_token', fakeToken)
      await login({ token: fakeToken, user: userObj })
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  const handleTrainerDemo = async (e) => {
    e?.preventDefault()
    setError(null)
    try {
      const fakeToken = 'demo-token-' + Math.random().toString(36).slice(2)
      const userObj = { id: Date.now(), name: email || 'Trainer', email, role: 'TRAINER' }
      localStorage.setItem('tm_user', JSON.stringify(userObj))
      localStorage.setItem('tm_token', fakeToken)
      await login({ token: fakeToken, user: userObj })
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  const handleGoogle = async () => {
    if (role === 'ADMIN') {
      setError('Google SSO not allowed for Admin. Use local admin credentials')
      return
    }
    setError(null)
    try {
      setLocalRoleForNextSignIn(role)
      await signInWithGoogle()
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Google sign-in failed')
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow text-center">
        <div className="text-gray-600">Checking authentication status…</div>
      </div>
    )
  }
  if (user) return null

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow px-4 sm:px-6">
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setRole('LEARNER')} className={`px-3 py-1 rounded ${role === 'LEARNER' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Learner</button>
          <button onClick={() => setRole('TRAINER')} className={`px-3 py-1 rounded ${role === 'TRAINER' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Trainer</button>
          <button onClick={() => setRole('ADMIN')} className={`px-3 py-1 rounded ${role === 'ADMIN' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Admin</button>
        </div>
      </div>

      {role === 'ADMIN' ? (
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Admin username</label>
            <input value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2 mt-1" placeholder="admin" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} required type="password" className="w-full border rounded px-3 py-2 mt-1" placeholder="admin" />
          </div>

          <div className="text-sm text-gray-500">For dev: username/password = <strong>admin/admin</strong>. Google SSO disabled for Admin.</div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button type="submit" className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded">Sign in as Admin</button>
            <button type="button" onClick={() => { setEmail('admin'); setPassword('admin') }} className="text-sm text-gray-500">Autofill</button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <button onClick={handleGoogle} className="w-full bg-white border rounded px-3 py-2 flex items-center gap-3 hover:shadow-sm">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm">Sign in with Google ({role})</span>
          </button>

          <div className="text-center text-sm text-gray-400">or</div>

          <form onSubmit={role === 'LEARNER' ? handleLearnerDemo : handleTrainerDemo} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">{role} Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2 mt-1" placeholder={`${role.toLowerCase()}@example.com`} />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} required type="password" className="w-full border rounded px-3 py-2 mt-1" placeholder="password" />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded">Sign in as {role === 'LEARNER' ? 'Learner' : 'Trainer'}</button>
              <button type="button" onClick={() => { setEmail(`${role.toLowerCase()}@example.com`); setPassword('demo') }} className="text-sm text-gray-500">Autofill demo</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
