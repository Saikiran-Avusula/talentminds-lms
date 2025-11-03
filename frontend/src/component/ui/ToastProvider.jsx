/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const typeClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warn: 'bg-yellow-50 border-yellow-200 text-yellow-800'
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type: opts.type || 'info', duration: opts.duration || 3000, persist: !!opts.persist }
    setToasts((t) => [toast, ...t])
    if (!toast.persist) {
      setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), toast.duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter(x => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="space-y-3 w-full max-w-sm pointer-events-auto">
          {toasts.map(t => (
            <div key={t.id} className={`w-full border ${typeClasses[t.type] || typeClasses.info} rounded shadow p-3 flex items-start gap-3 mx-auto`}>
              <div className="flex-shrink-0">
                {t.type === 'success' && <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">✓</div>}
                {t.type === 'error' && <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-700">✕</div>}
                {t.type === 'info' && <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">i</div>}
                {t.type === 'warn' && <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700">!</div>}
              </div>
              <div className="text-sm">{t.message}</div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}


export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
