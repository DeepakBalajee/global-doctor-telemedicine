'use client'

import React, { useState } from 'react'
import { DoctorDashboardHeader } from './DoctorDashboardHeader'
import { DoctorDashboardSidebar } from './DoctorDashboardSidebar'

export interface DoctorDashboardLayoutProps {
  children: React.ReactNode
  doctorName?: string
  specialtyName?: string
  licenseNumber?: string
}

export const DoctorDashboardLayout: React.FC<DoctorDashboardLayoutProps> = ({
  children,
  doctorName = 'Dr. Sarah Jenkins',
  specialtyName = 'Cardiology',
  licenseNumber = 'MCI-889012',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <DoctorDashboardHeader
        doctorName={doctorName}
        specialtyName={specialtyName}
        licenseNumber={licenseNumber}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <DoctorDashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
