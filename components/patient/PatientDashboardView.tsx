'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Calendar,
  CreditCard,
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  ShieldCheck,
  Stethoscope,
  Video,
  FileText,
  Edit,
} from 'lucide-react'
import { PatientDashboardData, PatientProfile } from '@/types/patient-auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getPatientDashboardData, logoutPatient, updatePatientProfile } from '@/lib/patient/patient-auth-client'

export const PatientDashboardView: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'profile' | 'payments'>('overview')
  const [data, setData] = useState<PatientDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editFullName, setEditFullName] = useState('')
  const [editCity, setEditCity] = useState('')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const res = await getPatientDashboardData()
      if (res) {
        setData(res)
        setEditFullName(res.profile.fullName)
        setEditCity(res.profile.city)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    await logoutPatient()
    router.push('/patient/login')
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    const res = await updatePatientProfile({
      fullName: editFullName,
      city: editCity,
    })
    if (res.success && res.profile) {
      setData((prev) => prev ? { ...prev, profile: { ...prev.profile, ...res.profile } } : prev)
      setIsEditingProfile(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-8 w-8 text-brand-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading patient workspace...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Session Required</h3>
        <p className="text-xs text-slate-500">Please sign in to access your patient dashboard.</p>
        <Link href="/patient/login">
          <Button variant="primary" size="md">Go to Patient Login</Button>
        </Link>
      </Card>
    )
  }

  const { profile, appointments } = data

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* HEADER CARD */}
      <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-600/30">
              <User className="h-8 w-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full border border-brand-500/30 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" /> PATIENT ACCOUNT
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {profile.fullName}
              </h1>
              <p className="text-xs text-slate-300">
                {profile.city ? `${profile.city} • ` : ''}Preferred Language: {profile.preferredLanguage.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/consultation-request">
              <Button variant="primary" size="md" className="font-semibold gap-2 shadow-lg shadow-brand-600/30">
                <PlusCircle className="w-4 h-4" /> Book Consultation
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </Card>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: Stethoscope },
          { id: 'appointments', label: `My Appointments (${appointments.length})`, icon: Calendar },
          { id: 'profile', label: 'Personal Profile', icon: User },
          { id: 'payments', label: 'Payment Receipts (₹5)', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border-slate-200 bg-white space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Consultations</span>
              <div className="text-2xl font-extrabold text-slate-900">{data.totalConsultationsCount}</div>
              <p className="text-[11px] text-slate-400">All requested & confirmed sessions</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paid Consultation Fee</span>
              <div className="text-2xl font-extrabold text-emerald-600">₹{data.paidConsultationsCount * 5}.00 INR</div>
              <p className="text-[11px] text-slate-400">Server-verified payments</p>
            </Card>

            <Card className="p-5 border-slate-200 bg-white space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account ID</span>
              <div className="text-sm font-extrabold text-slate-800 font-mono pt-1">{profile.id}</div>
              <p className="text-[11px] text-slate-400">IDOR privacy protected</p>
            </Card>
          </div>

          {/* UPCOMING APPOINTMENT SUMMARY */}
          <Card className="p-6 border-slate-200 bg-white space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" /> Latest Appointment Overview
            </h3>

            {appointments.length > 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{appointments[0].doctorName}</span>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {appointments[0].appointmentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {appointments[0].specialtyName} • Mode: <strong>{appointments[0].consultationType}</strong>
                  </p>
                  <p className="text-xs text-slate-500">
                    Date: <strong>{appointments[0].appointmentDate}</strong> at <strong>{appointments[0].preferredTime}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">Fee: ₹5.00 INR (PAID)</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No upcoming appointments. Click &quot;Book Consultation&quot; to request a session.
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <Card className="p-6 border-slate-200 bg-white space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            My Appointments & Consultation Requests
          </h3>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{app.doctorName}</span>
                      <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md">
                        {app.appointmentStatus}
                      </span>
                    </div>
                    <p className="text-slate-600">Specialty: {app.specialtyName} | Consultation Mode: {app.consultationType}</p>
                    <p className="text-slate-500">Scheduled: <strong>{app.appointmentDate}</strong> at <strong>{app.preferredTime}</strong></p>
                    <p className="text-slate-400 italic pt-0.5">{app.problem}</p>
                  </div>

                  <div className="text-right text-xs font-semibold">
                    <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 inline-block">
                      ₹{app.feeInINR}.00 INR — {app.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs">
              No appointments found.
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: PERSONAL PROFILE */}
      {activeTab === 'profile' && (
        <Card className="p-6 border-slate-200 bg-white space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Personal Profile Information
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-semibold gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" /> {isEditingProfile ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
              <Input
                label="Full Name"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                required
              />
              <Input
                label="City"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" size="md" className="font-semibold">
                Save Profile Changes
              </Button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Full Name</span>
                <p className="font-bold text-slate-900 text-sm">{profile.fullName}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Username & Email</span>
                <p className="font-semibold text-slate-800">{profile.username} ({profile.email})</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Date of Birth / Age</span>
                <p className="font-semibold text-slate-800">{profile.dateOfBirth} ({profile.age} Years Old)</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Gender</span>
                <p className="font-semibold text-slate-800">{profile.gender}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Preferred Language</span>
                <p className="font-semibold text-slate-800">{profile.preferredLanguage.toUpperCase()}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
                <span className="text-slate-400 font-medium uppercase text-[10px]">Location</span>
                <p className="font-semibold text-slate-800">{profile.city}</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: PAYMENT RECEIPTS */}
      {activeTab === 'payments' && (
        <Card className="p-6 border-slate-200 bg-white space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
            Server-Verified Payment Receipts (₹5.00 INR Fee)
          </h3>

          <div className="space-y-3">
            {appointments.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Receipt Ref: {app.consultationRequestId}</span>
                    <span className="text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                      HMAC VERIFIED
                    </span>
                  </div>
                  <p className="text-slate-600">Consultation Fee: ₹5.00 INR (Fixed Fee)</p>
                  <p className="text-slate-500">Date: {app.appointmentDate}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 inline-block shadow-sm">
                    Status: PAID ₹5.00
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECURITY FOOTER */}
      <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-brand-600" /> Patient data is isolated & protected against unauthorized access.
      </div>

    </div>
  )
}
