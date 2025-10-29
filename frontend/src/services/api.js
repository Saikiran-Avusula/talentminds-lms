//   # axios instance, auth token helper

// src/services/api.js
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

// Attach token to requests if present
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('tm_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('tm_token')
    delete api.defaults.headers.common['Authorization']
  }
}

// initialize from localStorage on load
const saved = localStorage.getItem('tm_token')
if (saved) {
  api.defaults.headers.common['Authorization'] = `Bearer ${saved}`
}

export default api
