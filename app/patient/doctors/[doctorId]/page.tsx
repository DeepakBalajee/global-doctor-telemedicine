'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Stethoscope,
  Award,
  Calendar,
  Clock,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { DoctorProfile } from '@/types/doctor'
import { GeneratedAppointmentSlot } from '@/types/availability'
import { ConsultationType, GenderOption } from '@/types/patient'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { TimeSlotPicker } from '@/components/patient/TimeSlotPicker'
import { getVerifiedDoctors, getDoctorAvailableSlots, reserveAppointmentSlot } from '@/lib/patient/doctor-search-client'

export default function DoctorBookingPage({ params }: { params: { doctorId: string } }) {
  const router = useRouter()
  const { doctorId } = params

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow as default
  )
  const [slots, setSlots] = useState<GeneratedAppointmentSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<GeneratedAppointmentSlot | null>(null)

  // Patient Details form fields
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<GenderOption>('MALE')
  const [problem, setProblem] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [city, setCity] = useState('')

  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isReserving, setIsReserving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadDoctor() {
      const list = await getVerifiedDoctors()
      const found = list.find((d) => d.id === doctorId)
      if (found) setDoctor(found)
    }
    loadDoctor()
  }, [doctorId])

  useEffect(() => {
    async function loadSlots() {
      if (!doctorId || !selectedDate) return
      setIsLoadingSlots(true)
      setSelectedSlot(null)
      const res = await getDoctorAvailableSlots(doctorId, selectedDate)
      setSlots(res)
      setIsLoadingSlots(false)
    }
    loadSlots()
  }, [doctorId, selectedDate])

  const handleReserveAndPay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) {
      setErrorMessage('Please select an available consultation time slot.')
      return
    }

    if (!fullName.trim() || !dateOfBirth || !problem.trim() || !city.trim()) {
      setErrorMessage('Please fill in all required patient consultation details.')
      return
    }

    setErrorMessage(null)
    setIsReserving(true)

    try {
      // Atomic Slot Reservation Check
      const result = await reserveAppointmentSlot({
        doctorId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        consultationType: selectedSlot.consultationType,
        patientDetails: {
          fullName: fullName.trim(),
          dateOfBirth,
          gender,
          problem: problem.trim(),
          preferredLanguage,
          cityTownVillage: city.trim(),
        },
      })

      if (result.success && result.consultationRequestId) {
        // Redirect to Server-Verified ₹5 Payment Route
        router.push(`/patient/payment?consultationRequestId=${result.consultationRequestId}`)
      } else {
        setErrorMessage(result.error || 'This slot is no longer available. Please choose another time.')
      }
    } catch {
      setErrorMessage('Unable to reserve slot. Please try again.')
    } finally {
      setIsReserving(false)
    }
  }

  if (!doctor) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <svg className="animate-spin h-7 w-7 text-teal-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">Loading doctor profile & schedule...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* BACK LINK */}
        <Link href="/patient/doctors" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700">
          <ArrowLeft className="w-4 h-4" /> Back to Verified Doctor Directory
        </Link>

        {/* DOCTOR SUMMARY CARD */}
        <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white font-bold shadow-md">
                <Stethoscope className="w-8 h-8 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> VERIFIED DOCTOR
                  </span>
                  <span className="text-xs font-semibold text-slate-400 font-mono">Lic: {doctor.licenseNumber}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{doctor.fullName}</h1>
                <p className="text-xs font-semibold text-teal-700">
                  {doctor.doctorType === 'SPECIALIST' ? `Specialist in ${doctor.specialtyName}` : 'General Physician'} • {doctor.experienceYears} Yrs Exp
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500 space-y-1">
              <p>Consultation Fee: <strong className="text-emerald-700">₹5.00 INR</strong></p>
              <p>Location: <strong>{doctor.city}, {doctor.state}</strong></p>
            </div>
          </div>
        </Card>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
            {errorMessage}
          </div>
        )}

        {/* SLOT SELECTION & BOOKING FORM */}
        <Card className="p-6 sm:p-8 border-slate-200 bg-white rounded-2xl space-y-6">
          <form onSubmit={handleReserveAndPay} className="space-y-6" noValidate>
            
            {/* STEP 1: SELECT DATE */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                1. Select Consultation Date *
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* STEP 2: SELECT TIME SLOT */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                2. Select Available Time Slot *
              </label>
              <TimeSlotPicker
                slots={slots}
                selectedSlotId={selectedSlot?.slotId || null}
                onSelectSlot={setSelectedSlot}
                isLoading={isLoadingSlots}
              />
            </div>

            {/* STEP 3: PATIENT DETAILS */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                3. Patient Details & Consultation Reason *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Patient Full Name *"
                  placeholder="e.g. Anita Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  label="Date of Birth *"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />

                <div>
                  <Select
                    label="Gender *"
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'NON_BINARY', label: 'Non-Binary' },
                      { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' },
                    ]}
                    value={gender}
                    onChange={(e) => setGender(e.target.value as GenderOption)}
                  />
                </div>

                <Input
                  label="City / Town *"
                  placeholder="e.g. Delhi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Problem / Health Concern * (Protected Privacy)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your symptom or health concern..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    required
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON TO ₹5 PAYMENT */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Consultation Fee: <strong className="text-emerald-700 text-sm">₹5.00 INR</strong>
              </div>

              <Button
                type="submit"
                variant="teal"
                size="lg"
                disabled={isReserving || !selectedSlot}
                className="font-bold text-xs gap-2 shadow-lg shadow-teal-600/20"
              >
                {isReserving ? 'Reserving Slot...' : 'Reserve Slot & Proceed to Pay ₹5'} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </form>
        </Card>

        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Atomic double-booking lock & server-verified ₹5 payment gateway.
        </div>

      </div>
    </div>
  )
}
