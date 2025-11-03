import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './component/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './component/route/ProtectedRoute'
import { ToastProvider } from './component/ui/ToastProvider'

const Home = lazy(() => import('./pages/Home'))
const CourseDetail = lazy(() => import('./pages/CourseDetail'))
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'))
const Login = lazy(() => import('./pages/auth/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TrainerDashboard = lazy(() => import('./pages/trainer/TrainerDashboard'))
const CourseEditor = lazy(() => import('./pages/trainer/CourseEditor'))
const TrainerApply = lazy(() => import('./pages/trainer/TrainerApply'))
const Explore = lazy(() => import('./pages/Explore'))
const TrainerProfile = lazy(() => import('./pages/trainer/TrainerProfile'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<div className="container mx-auto px-4 py-8 text-gray-600">Loading…</div>}>
          <Routes>
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />
            <Route path="/course/:id/player" element={<MainLayout><CoursePlayer /></MainLayout>} />
            <Route path="/auth/login" element={<MainLayout><Login /></MainLayout>} />

            {/* User routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Trainer routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/trainer/apply" element={<MainLayout><TrainerApply /></MainLayout>} />
            <Route path="/trainer" element={<TrainerDashboard />} />
            <Route path="/trainer/new" element={<CourseEditor />} />
            <Route path="/trainer/edit/:id" element={<CourseEditor />} />

            {/* Explore routes */}
            <Route path="/explore" element={<MainLayout><Explore /></MainLayout>} />
            <Route path="/trainer/profile" element={<TrainerProfile />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  )
}
