import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Activity, ShieldCheck, Lock, Globe } from 'lucide-react'

export interface AuthLayoutProps {
  children: ReactNode
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* HEADER BAR */}
      <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
            <Activity className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
              Global Doctor
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-brand-600">
              Telemedicine
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* MAIN SPLIT CONTENT */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* DESKTOP LEFT SIDE: HERO & SECURITY COPY */}
          <div className="hidden lg:flex lg:col-span-6 flex-col space-y-8 pr-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-800">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> Secure Healthcare Access
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Protected Portal for Patients & Healthcare Providers
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Access your verified appointments, digital prescriptions, medical document vault, and encrypted video consultation room with enterprise-grade security.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Lock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">End-to-End Encrypted Sessions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your medical history and video consultation streams are strictly isolated and protected.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Globe className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Global Specialist Availability</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect with board-verified doctors across multiple medical specialties worldwide.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Your account is protected with secure server-managed sessions and strict access controls.
            </p>
          </div>

          {/* RIGHT SIDE: LOGIN FORM CARD CONTAINER */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="w-full bg-white border-t border-slate-200/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Global Doctor Telemedicine Platform. All rights reserved.</p>
      </div>

    </div>
  )
}
