// import './App.css'


// import React from 'react' 

// function App() {

//   return (
//     <>
//         <h1 className="text-3xl font-bold underline">
//           Hello world....!
//         </h1>
//     </>
//   )
// }

// export default App



import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './component/layout/MainLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home/></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

