/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, ...opts }
    setToasts((t) => [toast, ...t])
    if (!opts.persist) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, opts.duration || 3000)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter(x => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="max-w-sm bg-white border rounded shadow p-3">
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
