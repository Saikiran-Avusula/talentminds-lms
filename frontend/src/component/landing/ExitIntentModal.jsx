// frontend/src/component/landing/ExitIntentModal.jsx
import React, { useEffect, useState } from 'react'

export default function ExitIntentModal({ open, onClose, onSubmit }) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    // small exit-intent: show when mouse leaves viewport (desktop)
    let timer
    function onMouseOut(e) {
      if (!open && e.clientY < 10) {
        onClose && onClose()
      }
    }
    if (!open) {
      window.addEventListener('mouseout', onMouseOut)
      timer = setTimeout(() => window.removeEventListener('mouseout', onMouseOut), 30000)
    }
    return () => { window.removeEventListener('mouseout', onMouseOut); clearTimeout(timer) }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded p-6 z-10 max-w-md w-full">
        <h3 className="text-lg font-semibold">Wait — grab our free guide</h3>
        <p className="text-sm text-gray-600 mt-2">Get a free ebook: “Top 10 Interview Projects for Java devs”. Enter your email below.</p>

        <div className="mt-4 flex gap-2">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 border rounded px-3 py-2" />
          <button onClick={() => onSubmit && onSubmit(email)} className="font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white bg-indigo-600 text-white">Send</button>
        </div>

        <div className="text-xs text-gray-400 mt-3">We’ll only send one email for the resource.</div>
      </div>
    </div>
  )
}
