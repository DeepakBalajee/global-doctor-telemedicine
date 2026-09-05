import React from 'react'
import Link from 'next/link'
import { Stethoscope, Calendar, Video, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const DoctorCTA: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      
      {/* Subtle Background Lighting */}
      <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: CALLOUT */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300">
              <Stethoscope className="w-3.5 h-3.5" /> For Healthcare Providers
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Grow Your Practice With Better Digital Care
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-xl">
              Empower your clinical workflow. Manage patient queues, accept online bookings, conduct HD video consultations, issue digital prescriptions, and maintain professional records seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <Calendar className="w-5 h-5 text-brand-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Automated Availability & Slots</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <Video className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Browser Video Consultations</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <FileText className="w-5 h-5 text-brand-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Digital Rx & Clinical Notes</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <Stethoscope className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">Verified Doctor Profile</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/doctor/register" className="w-full sm:w-auto">
                <Button variant="teal" size="lg" className="w-full sm:w-auto font-semibold gap-2">
                  Join as a Doctor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/doctor/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white">
                  Doctor Login
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: VISUAL CARD */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800 to-slate-850 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Doctor Portal Overview</h3>
                  <p className="text-xs text-slate-400">Streamlined clinical workstation</p>
                </div>
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">Patient Consultation Queue</p>
                    <p className="text-[11px] text-slate-400">Live queue management active</p>
                  </div>
                  <span className="text-xs font-bold text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-800">
                    Active
                  </span>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">HD Consultation Room</p>
                    <p className="text-[11px] text-slate-400">WebRTC Encrypted Stream</p>
                  </div>
                  <span className="text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800">
                    Encrypted
                  </span>
                </div>

                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">Digital Prescription Builder</p>
                    <p className="text-[11px] text-slate-400">Instant patient delivery</p>
                  </div>
                  <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md">
                    Ready
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-slate-400">
                  Designed to support medical compliance & credential verification workflows.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
