'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, Award, MapPin, Globe, Calendar, ArrowRight, Search, ShieldCheck } from 'lucide-react'
import { DoctorProfile } from '@/types/doctor'
import { SPECIALTIES_DATA } from '@/data/specialties'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { getVerifiedDoctors } from '@/lib/patient/doctor-search-client'

export const DoctorSearchGrid: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [specialtyId, setSpecialtyId] = useState('')
  const [doctorType, setDoctorType] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadDoctors() {
      setIsLoading(true)
      const res = await getVerifiedDoctors({
        specialtyId: specialtyId || undefined,
        doctorType: doctorType || undefined,
        search: searchQuery || undefined,
      })
      setDoctors(res)
      setIsLoading(false)
    }
    loadDoctors()
  }, [specialtyId, doctorType, searchQuery])

  const specialtyOptions = [
    { value: '', label: 'All Medical Specialties' },
    ...SPECIALTIES_DATA.map((s) => ({ value: s.id, label: s.name })),
  ]

  const categoryOptions = [
    { value: '', label: 'All Doctor Categories' },
    { value: 'GENERAL_PHYSICIAN', label: 'General (MBBS)' },
    { value: 'SPECIALIST', label: 'Specialist' },
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER & SEARCH FILTERS */}
      <div className="space-y-4 text-center sm:text-left border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Verified Doctor Directory
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find & Book Verified Telemedicine Doctors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Select a verified General Physician or Specialist, check real-time calculated available slots, and book your consultation with ₹5 payment verification.
        </p>

        {/* FILTER BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
          <Input
            placeholder="Search by doctor name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />

          <Select
            options={specialtyOptions}
            value={specialtyId}
            onChange={(e) => setSpecialtyId(e.target.value)}
            icon={<Award className="w-4 h-4 text-slate-400" />}
          />

          <Select
            options={categoryOptions}
            value={doctorType}
            onChange={(e) => setDoctorType(e.target.value)}
            icon={<Stethoscope className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-xs font-semibold text-slate-500">Loading verified doctors...</p>
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Card key={doc.id} className="p-6 border-slate-200 bg-white rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-200">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100 font-bold">
                    <Stethoscope className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-teal-100 text-teal-900 px-2.5 py-1 rounded-full border border-teal-200">
                    VERIFIED DOCTOR
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{doc.fullName}</h3>
                  <p className="text-xs font-semibold text-teal-700">
                    {doc.doctorType === 'SPECIALIST' ? `Specialist in ${doc.specialtyName}` : 'General (MBBS)'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                    {doc.medicalQualification} • {doc.experienceYears} Years Exp
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.bio}
                </p>

                <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Languages: <strong>{doc.languages.join(', ').toUpperCase()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: <strong>{doc.city}, {doc.state}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link href={`/patient/doctors/${doc.id}`} className="w-full block">
                  <Button variant="teal" size="md" fullWidth className="font-bold text-xs gap-2">
                    <Calendar className="w-4 h-4" /> View Slots & Book (₹5)
                  </Button>
                </Link>
              </div>

            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-3 max-w-md mx-auto">
          <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Verified Doctors Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your specialty or location search filter.</p>
        </Card>
      )}

    </div>
  )
}
