// frontend/src/component/landing/FeaturesGrid.jsx
import React from 'react'

const FeatureCard = ({ icon, title, text }) => (
  <div className="bg-white rounded shadow-sm p-5">
    <div className="w-12 h-12 mb-3 flex items-center justify-center rounded bg-indigo-50 text-indigo-600">
      {icon}
    </div>
    <div className="font-semibold">{title}</div>
    <div className="text-sm text-gray-600 mt-1">{text}</div>
  </div>
)

export default function FeaturesGrid({ features = [] }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Why TalentMinds</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map(f => <FeatureCard key={f.id} icon={f.icon} title={f.title} text={f.text} />)}
        </div>
      </div>
    </section>
  )
}
