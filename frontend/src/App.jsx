

// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
// import CourseDetail from './pages/CourseDetail'
// import MainLayout from './component/layout/MainLayout'


// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainLayout><Home/></MainLayout>} />
//       <Route path="/course/:id" element={<MainLayout><CourseDetail/></MainLayout>} />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CourseDetail from './pages/CourseDetail'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
// import MainLayout from './components/layout/MainLayout'
import MainLayout from './component/layout/MainLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './component/route/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout><Home/></MainLayout>} />
        <Route path="/course/:id" element={<MainLayout><CourseDetail/></MainLayout>} />
        <Route path="/auth/login" element={<MainLayout><Login/></MainLayout>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><Dashboard/></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}


