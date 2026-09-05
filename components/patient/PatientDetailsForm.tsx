'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  FileText,
  ShieldCheck,
  ArrowRight,
  Clock,
  UserCheck,
} from 'lucide-react'
import { GenderOption, ConsultationType } from '@/types/patient'
import { SUPPORTED_LANGUAGES } from '@/data/languages'
import { AVAILABLE_TIME_SLOTS } from '@/data/time-slots'
import { ConsultationTypeSelector } from './ConsultationTypeSelector'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { createConsultationRequest } from '@/lib/patient/consultation-client'

export const PatientDetailsForm: React.FC = () => {
  const router = useRouter()

  // Required Fields State
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<GenderOption>('MALE')
  const [problem, setProblem] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [cityTownVillage, setCityTownVillage] = useState('')
  const [consultationType, setConsultationType] = useState<ConsultationType>('ONLINE_VIDEO')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('10:00 AM')

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Calculate age preview from Date of Birth
  const calculatedAge = dateOfBirth
    ? Math.max(
        0,
        Math.floor(
          (new Date().getTime() - new Date(dateOfBirth).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        )
      )
    : null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setErrorMessage(null)

    // Validation
    if (
      !fullName.trim() ||
      !dateOfBirth ||
      !gender ||
      !problem.trim() ||
      !preferredLanguage ||
      !cityTownVillage.trim() ||
      !appointmentDate ||
      !preferredTime
    ) {
      setErrorMessage('Please fill in all required fields marked with an asterisk (*).')
      return
    }

    // Check future date
    const selectedDate = new Date(appointmentDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(selectedDate.getTime()) || selectedDate < today) {
      setErrorMessage('Please select a valid future appointment date.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createConsultationRequest({
        patientDetails: {
          fullName: fullName.trim(),
          dateOfBirth,
          age: calculatedAge || undefined,
          gender,
          problem: problem.trim(),
          preferredLanguage,
          cityTownVillage: cityTownVillage.trim(),
        },
        consultationType,
        appointmentDate,
        preferredTime,
      })

      if (result.success && result.data) {
        // Route to ₹5 payment preparation step passing the consultationRequestId
        router.push(`/patient/payment?consultationRequestId=${result.data.consultationRequestId}`)
      } else {
        setErrorMessage(result.error || 'We couldn’t submit your request right now. Please try again.')
      }
    } catch {
      setErrorMessage('We couldn’t submit your request right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'NON_BINARY', label: 'Non-Binary' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
  ]

  const languageOptions = SUPPORTED_LANGUAGES.map((l) => ({
    value: l.code,
    label: `${l.name} (${l.nativeName})`,
  }))

  const timeSlotOptions = AVAILABLE_TIME_SLOTS.map((t) => ({
    value: t.label,
    label: t.label,
  }))

  // Min date for appointment picker (today)
  const minDateStr = new Date().toISOString().split('T')[0]

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-3xl mx-auto space-y-8">
      
      {/* HEADER & ACCOUNT LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
            Consultation Request
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Consultation Details
          </h1>
          <p className="text-xs text-slate-500">
            Provide your details below to schedule your consultation slot.
          </p>
        </div>

        <Link
          href="/login"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50/80 px-3 py-2 rounded-lg border border-brand-100 hover:bg-brand-100/80 transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" /> Already have an account? Sign In
        </Link>
      </div>

      {/* ERROR ALERT BANNER */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-label="Patient details form">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              1. Patient Personal Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="sm:col-span-2">
              <Input
                label="Full Name *"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Input
                label="Date of Birth *"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                disabled={isSubmitting}
                max={minDateStr}
                icon={<CalendarIcon className="w-4 h-4" />}
              />
              {calculatedAge !== null && (
                <p className="mt-1 text-[11px] font-medium text-brand-700">
                  Calculated Age: <span className="font-bold">{calculatedAge} years</span>
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Select
                label="Gender *"
                options={genderOptions}
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderOption)}
                required
                disabled={isSubmitting}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            {/* Preferred Language */}
            <div>
              <Select
                label="Preferred Language *"
                options={languageOptions}
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                required
                disabled={isSubmitting}
                icon={<Globe className="w-4 h-4" />}
              />
            </div>

            {/* Location (City / Town / Village) */}
            <div>
              <Input
                label="Location (City / Town / Village) *"
                placeholder="e.g. Mumbai, Delhi, Bengaluru"
                value={cityTownVillage}
                onChange={(e) => setCityTownVillage(e.target.value)}
                required
                disabled={isSubmitting}
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Problem Description (Sensitive) */}
            <div className="sm:col-span-2">
              <label htmlFor="problem-desc" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Problem / Reason for Consultation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="problem-desc"
                rows={3}
                placeholder="Briefly describe your medical symptoms, health problem, or reason for requesting a consultation"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-slate-200 rounded-lg p-3 transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                🔒 Your health description is protected with clinical privacy controls.
              </p>
            </div>

          </div>
        </div>

        {/* SECTION 2: CONSULTATION & APPOINTMENT PREFERENCES */}
        <div className="space-y-5 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              2. Consultation & Schedule Preferences
            </h3>
          </div>

          {/* Consultation Type Selector */}
          <ConsultationTypeSelector
            value={consultationType}
            onChange={setConsultationType}
            disabled={isSubmitting}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Appointment Date */}
            <div>
              <Input
                label="Appointment Date *"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={minDateStr}
                required
                disabled={isSubmitting}
                icon={<CalendarIcon className="w-4 h-4" />}
              />
            </div>

            {/* Preferred Time Slot */}
            <div>
              <Select
                label="Preferred Time Slot *"
                options={timeSlotOptions}
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                required
                disabled={isSubmitting}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>

          </div>
        </div>

        {/* FEE NOTICE HIGHLIGHT */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-100 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-900">Consultation / Appointment Fee</p>
            <p className="text-[11px] text-slate-600">
              Required before appointment confirmation.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-700">₹5.00</span>
          </div>
        </div>

        {/* PRIVACY NOTICE */}
        <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Your information is used to help arrange your requested healthcare service and is protected according to the platform&apos;s privacy and security policies.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          className="h-12 text-sm font-semibold shadow-lg shadow-brand-600/20"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Submitting...
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              Submit & Proceed to Fee Payment (₹5) <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

      </form>

    </Card>
  )
}
