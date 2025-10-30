// src/components/domain/ModuleEditor.jsx
import React from 'react'

export default function ModuleEditor({ module, onChange, onRemove }) {
  const set = (patch) => onChange(module.id, patch)

  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-700">Module title</label>
          <input value={module.title} onChange={e => set({ title: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" />

          <label className="block text-sm text-gray-700 mt-2">Description</label>
          <textarea value={module.description} onChange={e => set({ description: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" rows={2} />

          <label className="block text-sm text-gray-700 mt-2">Content URL (optional)</label>
          <input value={module.contentUrl} onChange={e => set({ contentUrl: e.target.value })} className="w-full border rounded px-2 py-1 mt-1" placeholder="https://..." />
        </div>

        <div className="flex-shrink-0">
          <button onClick={onRemove} className="text-sm text-red-600">Remove</button>
        </div>
      </div>
    </div>
  )
}
