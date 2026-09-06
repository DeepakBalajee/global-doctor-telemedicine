'use client'

import React from 'react'
import Link from 'next/link'
import { Activity, Menu, X } from 'lucide-react'
import { HEADER_NAV_ITEMS } from '@/data/navigation'
import { useAppStore } from '@/lib/store/use-app-store'
import { Button } from '@/components/ui/Button'

export const Header: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useAppStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* LEFT: Platform logo & Name */}
          <Link 
            href="/" 
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg p-1"
            aria-label="Global Doctor Telemedicine Platform Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <Activity className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                Global Doctor
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                Telemedicine
              </span>
            </div>
          </Link>

          {/* CENTER / LEFT: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {HEADER_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Desktop Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-700">
                Log In
              </Button>
            </Link>
            <Link href="/patient/register">
              <Button variant="primary" size="sm" className="font-semibold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-menu" 
          className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-xl animate-in slide-in-from-top duration-200"
        >
          <div className="space-y-1 pb-4 pt-2">
            {HEADER_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-brand-600"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="outline" size="md" fullWidth className="font-semibold text-slate-700">
                Log In
              </Button>
            </Link>
            <Link href="/patient/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
              <Button variant="primary" size="md" fullWidth className="font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
