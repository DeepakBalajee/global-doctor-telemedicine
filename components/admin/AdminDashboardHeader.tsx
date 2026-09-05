'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShieldCheck,
  Crown,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export interface AdminDashboardHeaderProps {
  adminName?: string
  role?: string
  onToggleSidebar?: () => void
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  adminName = 'Dr. Michael Vance (Admin)',
  role = 'ADMIN',
  onToggleSidebar,
}) => {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isSuperAdmin = role === 'SUPER_ADMIN'

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    router.push(isSuperAdmin ? '/super-admin/login' : '/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
      
      {/* LEFT: BRAND & SIDEBAR TOGGLE */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href={isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard'} className="flex items-center gap-2.5 group">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold shadow-md transition-transform group-hover:scale-105 ${
              isSuperAdmin ? 'bg-amber-500 text-slate-950' : 'bg-brand-600 text-white'
            }`}
          >
            {isSuperAdmin ? <Crown className="h-5 w-5 stroke-[2.5]" /> : <ShieldCheck className="h-5 w-5 stroke-[2.5]" />}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">
              Global Doctor
            </span>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-widest pt-0.5 ${
                isSuperAdmin ? 'text-amber-400' : 'text-teal-400'
              }`}
            >
              {isSuperAdmin ? 'Super Admin Console' : 'Platform Administration'}
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: NOTIFICATION BELL & PROFILE MENU */}
      <div className="flex items-center gap-3">
        
        {/* NOTIFICATION BELL */}
        <NotificationBell role={role} />

        {/* ROLE BADGE */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isSuperAdmin
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
          }`}
        >
          {isSuperAdmin ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />}
          <span>{isSuperAdmin ? 'SUPER ADMIN' : 'HEAD MEMBER ADMIN'}</span>
        </div>

        {/* PROFILE DROPDOWN MENU */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white font-bold text-xs shadow-sm">
              {adminName.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-200 leading-tight">{adminName}</span>
              <span className="text-[10px] text-slate-400">{role}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* DROPDOWN CONTENT */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{adminName}</p>
                <p className="text-[10px] text-slate-500">Role: {role}</p>
              </div>

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
