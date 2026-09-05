'use client'

import React, { useState, useEffect } from 'react'
import { Award, CheckCircle2, Edit, Globe, MapPin, Stethoscope, User, ShieldCheck } from 'lucide-react'
import { DoctorProfile } from '@/types/doctor'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getDoctorProfile, updateDoctorProfile } from '@/lib/doctor/doctor-dashboard-client'

export const DoctorProfileView: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Edit fields
  const [editBio, setEditBio] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editState, setEditState] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true)
      const res = await getDoctorProfile()
      if (res) {
        setProfile(res)
        setEditBio(res.bio || '')
        setEditCity(res.city || '')
        setEditState(res.state || '')
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    const res = await updateDoctorProfile({
      bio: editBio,
      city: editCity,
      state: editState,
    })
    if (res.success && res.profile) {
      setProfile({ ...profile, ...res.profile })
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading doctor profile...</p>
      </div>
    )
  }

  if (!profile) return null

  return (
    <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl space-y-6 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-3 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> VERIFIED DOCTOR
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {profile.fullName}
          </h2>
          <p className="text-xs text-slate-500">
            {profile.doctorType === 'SPECIALIST' ? `Specialist in ${profile.specialtyName}` : 'General Physician'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold gap-1.5"
        >
          <Edit className="w-3.5 h-3.5 text-teal-600" /> {isEditing ? 'Cancel' : 'Edit Bio & Location'}
        </Button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Professional Bio
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={editCity} onChange={(e) => setEditCity(e.target.value)} />
            <Input label="State" value={editState} onChange={(e) => setEditState(e.target.value)} />
          </div>

          <Button type="submit" variant="teal" size="md" className="font-semibold">
            Save Profile Updates
          </Button>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Doctor Category</span>
            <p className="font-bold text-slate-900 text-sm">
              {profile.doctorType === 'SPECIALIST' ? `Specialist (${profile.specialtyName})` : 'General Physician'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Medical License Number</span>
            <p className="font-bold text-slate-900 font-mono text-sm">{profile.licenseNumber}</p>
            <p className="text-[10px] text-slate-400">Authority: {profile.licensingAuthority}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Medical Qualification</span>
            <p className="font-bold text-slate-900">{profile.medicalQualification} ({profile.experienceYears} Years Exp)</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Languages Spoken</span>
            <p className="font-bold text-slate-900">{profile.languages.join(', ').toUpperCase()}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1 sm:col-span-2">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Professional Bio</span>
            <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-1 sm:col-span-2">
            <span className="text-slate-400 font-medium uppercase text-[10px]">Practice Location</span>
            <p className="font-bold text-slate-900">{profile.city}, {profile.state}, {profile.country}</p>
          </div>

        </div>
      )}

      <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-teal-600" /> Administrative & license credentials are strictly protected against unauthorized frontend edits.
      </div>

    </Card>
  )
}
