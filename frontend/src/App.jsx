
// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
// import MainLayout from './component/layout/MainLayout'

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<MainLayout><Home/></MainLayout>} />
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CourseDetail from './pages/CourseDetail'
import MainLayout from './component/layout/MainLayout'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home/></MainLayout>} />
      <Route path="/course/:id" element={<MainLayout><CourseDetail/></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

