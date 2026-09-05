'use client'

import React, { useState } from 'react'
import { AdminDashboardHeader } from './AdminDashboardHeader'
import { AdminDashboardSidebar } from './AdminDashboardSidebar'

export interface AdminDashboardLayoutProps {
  children: React.ReactNode
  adminName?: string
  role?: string
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  adminName = 'Dr. Michael Vance (Admin)',
  role = 'ADMIN',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <AdminDashboardHeader
        adminName={adminName}
        role={role}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <AdminDashboardSidebar
          isOpen={isSidebarOpen}
          role={role}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
