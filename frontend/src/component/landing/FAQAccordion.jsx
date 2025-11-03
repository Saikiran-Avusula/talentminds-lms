// frontend/src/component/landing/FAQAccordion.jsx
import React, { useMemo, useState } from 'react'

function Chevron({ open }) {
  return (
    <svg className={`w-5 h-5 text-indigo-600 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12.998l-4.25 4.65a.75.75 0 01-1.12 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  )
}

export default function FAQAccordion({ faqs = [] }) {
  const [openId, setOpenId] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter(f => (f.q || '').toLowerCase().includes(q) || (f.a || '').toLowerCase().includes(q))
  }, [faqs, query])

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <section className="py-12 bg-gradient-to-b from-white to-indigo-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently asked questions</h2>
            <p className="text-sm text-gray-600 mt-1">Quick answers about trainers, courses, and enrollment.</p>
          </div>
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="M20 20l-3-3" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto">
          {filtered.map((f) => {
            const id = f.q || String(Math.random())
            const open = openId === id
            return (
              <div key={id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggle(id)}
                  className="w-full flex items-center justify-between gap-3 text-left px-5 py-4 hover:bg-gray-50"
                  aria-expanded={open ? 'true' : 'false'}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">Q</div>
                    <div className="font-medium text-gray-900">{f.q}</div>
                  </div>
                  <Chevron open={open} />
                </button>
                <div className={`px-5 transition-[grid-template-rows] duration-200 ease-in-out ${open ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <div className="py-4 text-sm text-gray-600 border-t border-gray-100">{f.a}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 text-sm text-gray-500">No results. Try another keyword.</div>
        )}

        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
            <span>Still have questions?</span>
            <a href="/trainer/apply" className="underline underline-offset-2">Contact us</a>
          </div>
        </div>
      </div>
    </section>
  )
}
