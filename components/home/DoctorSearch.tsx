'use client'

import React, { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Stethoscope, ArrowRight } from 'lucide-react'
import { SPECIALTIES_DATA } from '@/data/specialties'
import { useAppStore } from '@/lib/store/use-app-store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

export const DoctorSearch: React.FC = () => {
  const router = useRouter()
  const {
    searchQuery,
    searchLocation,
    selectedSpecialty,
    setSearchQuery,
    setSearchLocation,
    setSelectedSpecialty,
  } = useAppStore()

  const specialtyOptions = [
    { value: '', label: 'All Specialties' },
    ...SPECIALTIES_DATA.map((s) => ({ value: s.slug, label: s.name })),
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (searchLocation) params.set('location', searchLocation)
    if (selectedSpecialty) params.set('specialty', selectedSpecialty)
    
    router.push(`/doctors?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-elevated border border-slate-200/90"
      aria-label="Doctor search form"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        
        {/* Search Input */}
        <div className="md:col-span-4">
          <Input
            label="Doctor Name"
            placeholder="Search doctors or specialties"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Location Input */}
        <div className="md:col-span-3">
          <Input
            label="Location"
            placeholder="City or location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
          />
        </div>

        {/* Specialty Select */}
        <div className="md:col-span-3">
          <Select
            label="Specialty"
            options={specialtyOptions}
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            icon={<Stethoscope className="w-4 h-4" />}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="h-[42px] py-0 text-sm font-semibold flex items-center justify-center gap-2"
          >
            Search <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  )
}
