'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  CreditCard,
  Crown,
  ShieldCheck,
  ShieldAlert,
  Activity,
  X,
} from 'lucide-react'

export interface AdminDashboardSidebarProps {
  isOpen?: boolean
  role?: string
  onClose?: () => void
}

export const AdminDashboardSidebar: React.FC<AdminDashboardSidebarProps> = ({
  isOpen = false,
  role = 'ADMIN',
  onClose,
}) => {
  const pathname = usePathname()
  const isSuperAdmin = role === 'SUPER_ADMIN'

  const navItems = [
    {
      label: 'Overview',
      href: isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/admin/dashboard' || pathname === '/super-admin/dashboard',
    },
    {
      label: 'Doctors Directory',
      href: isSuperAdmin ? '/super-admin/doctors' : '/admin/doctors',
      icon: Stethoscope,
      active: pathname === '/admin/doctors' || pathname === '/super-admin/doctors',
    },
    {
      label: 'Patient Accounts',
      href: isSuperAdmin ? '/super-admin/patients' : '/admin/patients',
      icon: Users,
      active: pathname === '/admin/patients' || pathname === '/super-admin/patients',
    },
    {
      label: 'Platform Appointments',
      href: isSuperAdmin ? '/super-admin/appointments' : '/admin/appointments',
      icon: Calendar,
      active: pathname === '/admin/appointments' || pathname === '/super-admin/appointments',
    },
    {
      label: 'Payment Transactions',
      href: isSuperAdmin ? '/super-admin/payments' : '/admin/payments',
      icon: CreditCard,
      active: pathname === '/admin/payments' || pathname === '/super-admin/payments',
    },
    ...(isSuperAdmin
      ? [
          {
            label: 'Admin Members & Audit',
            href: '/super-admin/admins',
            icon: Crown,
            active: pathname === '/super-admin/admins',
          },
          {
            label: 'Security Dashboard',
            href: '/super-admin/security',
            icon: ShieldAlert,
            active: pathname === '/super-admin/security',
          },
          {
            label: 'System Status',
            href: '/super-admin/system-health',
            icon: Activity,
            active: pathname === '/super-admin/system-health',
          },
        ]
      : []),
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
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Navigation</span>
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

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  item.active
                    ? isSuperAdmin
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">Global Telemed Security</p>
          <p>Role-Based Access Guard</p>
        </div>
      </aside>
    </>
  )
}
