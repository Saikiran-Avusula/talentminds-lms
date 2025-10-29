import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CourseDetail from './pages/CourseDetail'
import CoursePlayer from './pages/CoursePlayer'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './component/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './component/route/ProtectedRoute'
import { ToastProvider } from './component/ui/ToastProvider'


export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<MainLayout><Home/></MainLayout>} />
          <Route path="/course/:id" element={<MainLayout><CourseDetail/></MainLayout>} />
          <Route path="/course/:id/player" element={<MainLayout><CoursePlayer/></MainLayout>} />
          <Route path="/auth/login" element={<MainLayout><Login/></MainLayout>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout><Dashboard/></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
