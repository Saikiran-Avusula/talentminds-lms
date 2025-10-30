import React from 'react'
import RoleProtectedRoute from '../../component/route/RoleProtectedRoute'
import MainLayout from '../../component/layout/MainLayout'
import UsersAdmin from '../../component/admin/UsersAdmin'
import ApplicationsAdmin from '../../component/admin/ApplicationsAdmin'
import CoursesAdmin from '../../component/admin/CoursesAdmin'
import EnrollmentsAdmin from '../../component/admin/EnrollmentsAdmin'
import SiteSettings from '../../component/admin/SiteSettings'

export default function AdminDashboardPage() {
  return (
    <RoleProtectedRoute requiredRole="ADMIN">
      <MainLayout>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-gray-500">Controlled UI for site operations</div>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <UsersAdmin />
              <CoursesAdmin />
            </div>

            <div className="space-y-4">
              <ApplicationsAdmin />
              <EnrollmentsAdmin />
              <SiteSettings />
            </div>
          </section>
        </div>
      </MainLayout>
    </RoleProtectedRoute>
  )
}
