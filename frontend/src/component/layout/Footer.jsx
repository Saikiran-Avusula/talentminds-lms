// src/component/layout/Footer.jsx
import React from 'react'
export default function Footer() {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-sm text-gray-600">
        <div className="text-center sm:text-left">© {new Date().getFullYear()} TalentMinds. Built 👨🏼‍💻 by {'{ Sai Kiran Avusula. }'}</div>
        <div className="flex gap-4">
          <a href="/terms" className="hover:text-indigo-600 transition-colors underline-offset-2 hover:underline">Terms</a>
          <a href="/privacy" className="hover:text-indigo-600 transition-colors underline-offset-2 hover:underline">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
