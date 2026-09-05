import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Video, Clock, ChevronRight } from 'lucide-react'
import { DoctorSearch } from './DoctorSearch'
import { Button } from '@/components/ui/Button'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60">
      
      {/* Subtle Background Accent Orbs */}
      <div className="absolute top-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-brand-200/40 blur-3xl opacity-70" />
      <div className="absolute top-1/3 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-teal-100/40 blur-3xl opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* TOP BADGE */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-subtle backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            Next-Generation Healthcare Platform
          </div>
        </div>

        {/* HERO MAIN CONTENT */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
            Expert Healthcare, <br className="hidden sm:inline" />
            <span className="text-gradient">Wherever You Are.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Discover verified specialist doctors, schedule online appointments, track real-time queue position, and consult securely via browser video calls.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/patient/doctors" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold gap-2 shadow-lg shadow-brand-600/20">
                Find a Doctor <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/consultation-request" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
                Book Consultation
              </Button>
            </Link>
          </div>

          {/* QUICK FEATURES SUMMARY BADGES */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> Board-Verified Doctors
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video className="w-4 h-4 text-teal-600" /> HD Video Consultations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-600" /> Real-time Smart Queue
            </span>
          </div>
        </div>

        {/* SEARCH INTERFACE CONTAINER */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <DoctorSearch />
        </div>

      </div>
    </section>
  )
}
