import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/ToastProvider'

const SETTINGS_KEY = 'tm_site_settings'
const defaults = { maintenanceMode: false, allowPublicSignups: true }

export default function SiteSettings() {
  const toast = useToast()
  const [settings, setSettings] = useState(defaults)

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) setSettings(JSON.parse(raw))
  }, [])

  const setAndSave = (patch) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    toast.showToast('Settings saved')
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-3">Site Settings</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Maintenance mode</div>
            <div className="text-sm text-gray-500">If enabled, the site shows a maintenance banner.</div>
          </div>
          <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setAndSave({ maintenanceMode: e.target.checked })} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Public signups</div>
            <div className="text-sm text-gray-500">Allow users to sign up without invitation.</div>
          </div>
          <input type="checkbox" checked={settings.allowPublicSignups} onChange={e => setAndSave({ allowPublicSignups: e.target.checked })} />
        </div>
      </div>
    </div>
  )
}
