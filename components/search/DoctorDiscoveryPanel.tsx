'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Stethoscope, MapPin, Calendar, Video, CheckCircle2, Star, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react'
import { DoctorSearchParams, DoctorSearchResponse } from '@/types/search'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { fetchDoctorSearchResults } from '@/lib/search/search-client'

export const DoctorDiscoveryPanel: React.FC = () => {
  const [params, setParams] = useState<DoctorSearchParams>({
    query: '',
    doctorType: 'ALL',
    specialization: 'ALL',
    location: 'ALL',
    availability: 'ALL',
    consultationType: 'ALL',
    page: 1,
    limit: 10,
  })

  const [data, setData] = useState<DoctorSearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // 300ms Debounce Handler for Query Keystrokes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(params.query || '')
    }, 300)
    return () => clearTimeout(handler)
  }, [params.query])

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const res = await fetchDoctorSearchResults({ ...params, query: debouncedQuery })
      setData(res)
      setIsLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, params.doctorType, params.specialization, params.location, params.availability, params.consultationType, params.page])

  const handleResetFilters = () => {
    setParams({
      query: '',
      doctorType: 'ALL',
      specialization: 'ALL',
      location: 'ALL',
      availability: 'ALL',
      consultationType: 'ALL',
      page: 1,
      limit: 10,
    })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HERO / SEARCH HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-bold text-teal-800">
          <Stethoscope className="w-4 h-4 text-teal-600" /> Patient Doctor Discovery Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find & Book Verified Telemedicine Doctors
        </h1>
        <p className="text-sm text-slate-600">
          Search qualified General Physicians and Specialists with ₹5 verified consultation booking.
        </p>

        {/* SEARCH BAR INPUT WITH DEBOUNCE */}
        <div className="relative pt-2">
          <Input
            value={params.query || ''}
            onChange={(e) => setParams({ ...params, query: e.target.value })}
            placeholder="Search by doctor name, specialty (Cardiology, General Medicine)..."
            className="pl-11 pr-4 py-3.5 text-sm rounded-2xl border-slate-300 shadow-lg focus:ring-2 focus:ring-teal-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-6" />
        </div>
      </div>

      {/* FILTER CONTROL BAR */}
      <Card className="p-5 border-slate-200 bg-white rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-teal-600" /> Filter Criteria
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          {/* DOCTOR TYPE */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Doctor Type</label>
            <select
              value={params.doctorType || 'ALL'}
              onChange={(e) => setParams({ ...params, doctorType: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Doctor Types</option>
              <option value="GENERAL">General Physician</option>
              <option value="SPECIALIST">Specialist Doctor</option>
            </select>
          </div>

          {/* SPECIALIZATION */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Specialization</label>
            <select
              value={params.specialization || 'ALL'}
              onChange={(e) => setParams({ ...params, specialization: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Specializations</option>
              {data?.specializations?.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* LOCATION */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Location</label>
            <select
              value={params.location || 'ALL'}
              onChange={(e) => setParams({ ...params, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Locations</option>
              {data?.locations?.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* AVAILABILITY */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Availability</label>
            <select
              value={params.availability || 'ALL'}
              onChange={(e) => setParams({ ...params, availability: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">Anytime</option>
              <option value="TODAY">Available Today</option>
              <option value="TOMORROW">Available Tomorrow</option>
              <option value="THIS_WEEK">Available This Week</option>
            </select>
          </div>

          {/* CONSULTATION TYPE */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Consultation Format</label>
            <select
              value={params.consultationType || 'ALL'}
              onChange={(e) => setParams({ ...params, consultationType: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-white font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="ALL">All Formats</option>
              <option value="ONLINE_VIDEO">Online Video</option>
              <option value="ONLINE_AUDIO">Online Audio</option>
              <option value="OFFLINE">In-Person Offline</option>
            </select>
          </div>

        </div>
      </Card>

      {/* RESULTS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing {data?.results?.length || 0} Doctor Results</span>
          {isLoading && <span className="text-teal-600 animate-pulse">Updating results...</span>}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400">Searching doctors...</div>
        ) : data?.results && data.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((doc) => (
              <Card key={doc.id} className="p-6 border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-5 flex flex-col justify-between">
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-base text-slate-900">{doc.fullName}</h3>
                        {doc.verificationStatus === 'VERIFIED' && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-900 inline-block">
                        {doc.specialization}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-900 text-xs font-extrabold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {doc.rating}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-emerald-700">Available: {doc.availability}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.consultationTypes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
                    <span className="text-base font-black text-slate-900">₹5.00 INR</span>
                  </div>

                  <Link href={`/patient/doctors/${doc.id}`}>
                    <Button variant="teal" size="sm" className="font-bold text-xs gap-1">
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-slate-200 bg-white rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">No doctors match your filter criteria.</h3>
            <p className="text-xs text-slate-500">Try broadening your search term or resetting your filter choices.</p>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="font-bold text-xs">
              Reset All Filters
            </Button>
          </Card>
        )}
      </div>

    </div>
  )
}
