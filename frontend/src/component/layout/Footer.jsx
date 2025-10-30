// src/component/layout/Footer.jsx
import React from 'react'
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-600">
        <div>© {new Date().getFullYear()} TalentMinds. Built 👨🏼‍💻 by {'{ Sai Kiran Avusula. }'}</div>
        <div className="flex gap-4">
          <a href="/terms" className="hover:text-indigo-600">Terms</a>
          <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
