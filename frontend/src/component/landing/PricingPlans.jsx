// frontend/src/component/landing/PricingPlans.jsx
import React from 'react'

export default function PricingPlans({ plans = [] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(p => (
            <div key={p.id} className="border rounded p-6 bg-white flex flex-col">
              <div className="text-lg font-semibold mb-2">{p.name}</div>
              <div className="text-3xl font-bold mb-4">{p.price}</div>
              <ul className="mb-6 text-sm text-gray-600 space-y-2">
                {p.bullets.map((b,i) => <li key={i}>• {b}</li>)}
              </ul>

              <div className="mt-auto">
                <button className="font-bold border border-indigo-600 rounded px-4 py-2 hover:bg-indigo-600 hover:text-white w-full">
                  {p.ctaLabel || 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
