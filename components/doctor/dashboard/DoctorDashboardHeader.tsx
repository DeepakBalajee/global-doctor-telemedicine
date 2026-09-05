'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Stethoscope,
  CheckCircle2,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { logoutDoctor } from '@/lib/doctor/doctor-auth-client'

export interface DoctorDashboardHeaderProps {
  doctorName?: string
  specialtyName?: string
  licenseNumber?: string
  onToggleSidebar?: () => void
}

export const DoctorDashboardHeader: React.FC<DoctorDashboardHeaderProps> = ({
  doctorName = 'Dr. Sarah Jenkins',
  specialtyName = 'Cardiology',
  licenseNumber = 'MCI-889012',
  onToggleSidebar,
}) => {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logoutDoctor()
    router.push('/doctor/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
      
      {/* LEFT: BRAND & SIDEBAR TOGGLE */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/doctor/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
            <Stethoscope className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              Global Doctor
            </span>
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest pt-0.5">
              Doctor Workstation
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: NOTIFICATIONS & DOCTOR PROFILE MENU */}
      <div className="flex items-center gap-3">
        
        {/* NOTIFICATIONS PLACEHOLDER */}
        <button
          type="button"
          title="Notifications (Coming Soon)"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
        </button>

        {/* VERIFIED BADGE */}
        <div className="hidden md:flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200 text-xs font-bold text-teal-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> VERIFIED
        </div>

        {/* PROFILE DROPDOWN MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs shadow-sm">
              {doctorName.charAt(4) || 'D'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 leading-tight">{doctorName}</span>
              <span className="text-[10px] text-slate-500">{specialtyName}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* DROPDOWN CONTENT */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{doctorName}</p>
                <p className="text-[10px] text-slate-500">License: {licenseNumber}</p>
              </div>

              <Link
                href="/doctor/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-teal-600" /> Doctor Profile
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  )
}
