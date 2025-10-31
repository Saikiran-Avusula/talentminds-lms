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
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import CourseEditor from './pages/trainer/CourseEditor'
import TrainerApply from './pages/trainer/TrainerApply'
import Explore from './pages/Explore'
import TrainerProfile from './pages/trainer/TrainerProfile'
import Profile from './pages/Profile'


import AdminDashboard from './pages/admin/AdminDashBoard'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<MainLayout><Home/></MainLayout>} />
          <Route path="/course/:id" element={<MainLayout><CourseDetail/></MainLayout>} />
          <Route path="/course/:id/player" element={<MainLayout><CoursePlayer/></MainLayout>} />
          <Route path="/auth/login" element={<MainLayout><Login/></MainLayout>} />

          {/* User routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout><Dashboard/></MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Trainer routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/trainer/apply" element={<MainLayout><TrainerApply/></MainLayout>} />
          <Route path="/trainer" element={<TrainerDashboard/>} />               // TrainerDashboard uses RoleProtectedRoute internally here
          <Route path="/trainer/new" element={<CourseEditor/>} />
          <Route path="/trainer/edit/:id" element={<CourseEditor/>} />

          {/* Explore routes */}
          <Route path="/explore" element={<MainLayout><Explore/></MainLayout>} />
          <Route path="/trainer/profile" element={<TrainerProfile/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
