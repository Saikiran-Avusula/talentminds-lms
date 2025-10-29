import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const fakeToken = 'demo-token-' + Math.random().toString(36).slice(2)
      const user = { id: 1, name: 'Demo User', email }
      await login({ token: fakeToken, user })
      const returnTo = location.state?.returnTo || '/dashboard'
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} required
                 className="w-full border rounded px-3 py-2 mt-1" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} required
                 type="password" className="w-full border rounded px-3 py-2 mt-1" placeholder="password" />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex items-center justify-between">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded">Sign in</button>
          <button type="button" onClick={() => { setEmail('demo@example.com'); setPassword('demo') }} 
                  className="text-sm text-gray-500">Use demo</button>
        </div>
      </form>
    </div>
  )
}
