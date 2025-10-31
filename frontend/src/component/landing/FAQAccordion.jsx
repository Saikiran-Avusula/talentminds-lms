// frontend/src/component/landing/FAQAccordion.jsx
import React, { useState } from 'react'

const Item = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b py-3">
      <button onClick={() => setOpen(s => !s)} className="w-full text-left flex items-center justify-between">
        <div className="font-medium">{q}</div>
        <div className="text-gray-500">{open ? '−' : '+'}</div>
      </button>
      {open && <div className="mt-2 text-sm text-gray-600">{a}</div>}
    </div>
  )
}

export default function FAQAccordion({ faqs = [] }) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
        <div className="max-w-3xl">
          {faqs.map((f, i) => <Item key={i} q={f.q} a={f.a} />)}
        </div>
      </div>
    </section>
  )
}
