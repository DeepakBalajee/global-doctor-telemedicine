'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Calendar,
  Users,
  Video,
  Clock,
  CreditCard,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { logoutDoctor } from '@/lib/doctor/doctor-auth-client'
import { useRouter } from 'next/navigation'

export interface DoctorDashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export const DoctorDashboardSidebar: React.FC<DoctorDashboardSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutDoctor()
    router.push('/doctor/login')
  }

  const navItems = [
    { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard, active: pathname === '/doctor/dashboard' },
    { label: 'Doctor Profile', href: '/doctor/profile', icon: User, active: pathname === '/doctor/profile' },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar, active: pathname.startsWith('/doctor/appointments') },
    { label: 'Availability', href: '/doctor/availability', icon: Clock, active: pathname === '/doctor/availability' },
    { label: 'Earnings & ₹5 Receipts', href: '#', icon: CreditCard, active: false, comingSoon: true },
    { label: 'Settings', href: '#', icon: Settings, active: false, comingSoon: true },
  ]

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 lg:hidden">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Navigation Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon

            if (item.comingSoon) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed select-none opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                    Soon
                  </span>
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  item.active
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* SIDEBAR FOOTER LOGOUT */}
        <div className="p-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
