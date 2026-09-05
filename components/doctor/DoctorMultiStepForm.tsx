'use client'

import React, { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Lock,
  Award,
  Globe,
  MapPin,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  FileText,
  UserCheck,
} from 'lucide-react'
import { DoctorType } from '@/types/doctor'
import { ConsultationType } from '@/types/patient'
import { SUPPORTED_LANGUAGES } from '@/data/languages'
import { DoctorTypeSelector } from './DoctorTypeSelector'
import { DoctorRegistrationSuccess } from './DoctorRegistrationSuccess'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { registerDoctor } from '@/lib/doctor/doctor-client'

export const DoctorMultiStepForm: React.FC = () => {
  const [step, setStep] = useState<number>(1)

  // Step 1: Account Information
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Step 2: Doctor Category
  const [doctorType, setDoctorType] = useState<DoctorType>('GENERAL_PHYSICIAN')
  const [specialtyId, setSpecialtyId] = useState('')

  // Step 3: Professional Credentials
  const [medicalQualification, setMedicalQualification] = useState('')
  const [experienceYears, setExperienceYears] = useState<number | ''>(5)
  const [licenseNumber, setLicenseNumber] = useState('')
  const [licensingAuthority, setLicensingAuthority] = useState('')
  const [bio, setBio] = useState('')

  // Step 4: Languages & Consultation & Location
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en', 'hi'])
  const [consultationModes, setConsultationModes] = useState<ConsultationType[]>([
    'ONLINE_VIDEO',
    'ONLINE_AUDIO',
  ])
  const [city, setCity] = useState('')
  const [town, setTown] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('India')

  // Step 5: Verification Documents Foundation
  const [qualificationCertName, setQualificationCertName] = useState('')
  const [licenseDocName, setLicenseDocName] = useState('')
  const [idProofName, setIdProofName] = useState('')

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [createdDoctorId, setCreatedDoctorId] = useState<string | undefined>()

  // Step Navigation Handlers with Step Validation
  const handleNextStep = () => {
    setErrorMessage(null)

    if (step === 1) {
      if (
        !fullName.trim() ||
        !username.trim() ||
        !email.trim() ||
        !mobileNumber.trim() ||
        !password ||
        !confirmPassword
      ) {
        setErrorMessage('Please fill in all required account fields.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.')
        return
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.')
        return
      }
    }

    if (step === 2) {
      if (doctorType === 'SPECIALIST' && !specialtyId) {
        setErrorMessage('Specialists must select a valid medical specialization.')
        return
      }
    }

    if (step === 3) {
      if (
        !medicalQualification.trim() ||
        experienceYears === '' ||
        Number(experienceYears) < 0 ||
        !licenseNumber.trim() ||
        !licensingAuthority.trim()
      ) {
        setErrorMessage('Please fill in all required professional credential fields.')
        return
      }
    }

    if (step === 4) {
      if (
        !selectedLanguages.length ||
        !consultationModes.length ||
        !city.trim() ||
        !state.trim() ||
        !country.trim()
      ) {
        setErrorMessage('Please select at least one language, one consultation mode, and enter your city, state & country.')
        return
      }
    }

    setStep((prev) => Math.min(prev + 1, 6))
  }

  const handlePrevStep = () => {
    setErrorMessage(null)
    setStep((prev) => Math.max(prev - 1, 1))
  }

  // Toggle Language Checkbox
  const handleLanguageToggle = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  // Toggle Consultation Mode Checkbox
  const handleConsultationModeToggle = (mode: ConsultationType) => {
    setConsultationModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  // File Selector Handler
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (name: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be under 5MB.')
        return
      }
      setter(file.name)
    }
  }

  // Submit Final Registration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const result = await registerDoctor({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        password,
        doctorType,
        specialtyId: doctorType === 'SPECIALIST' ? specialtyId : undefined,
        medicalQualification: medicalQualification.trim(),
        experienceYears: Number(experienceYears),
        licenseNumber: licenseNumber.trim(),
        licensingAuthority: licensingAuthority.trim(),
        bio: bio.trim(),
        languages: selectedLanguages,
        consultationModes,
        city: city.trim(),
        town: town.trim(),
        state: state.trim(),
        country: country.trim(),
        qualificationCertName,
        licenseDocName,
        idProofName,
      })

      if (result.success && result.doctorId) {
        setCreatedDoctorId(result.doctorId)
        setIsSuccess(true)
      } else {
        setErrorMessage(result.error || 'We couldn’t process your registration. Please try again.')
      }
    } catch {
      setErrorMessage('We couldn’t process your registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return <DoctorRegistrationSuccess doctorId={createdDoctorId} />
  }

  return (
    <Card className="p-6 sm:p-10 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-3xl mx-auto space-y-8">
      
      {/* HEADER & LOGIN LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> For Medical Professionals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Doctor Registration
          </h1>
          <p className="text-xs text-slate-500">
            Create your professional account to join the telemedicine doctor network.
          </p>
        </div>

        <Link
          href="/login?role=doctor"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/80 px-3 py-2 rounded-lg border border-teal-200 transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" /> Already registered? Sign In
        </Link>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>STEP {step} OF 6</span>
          <span className="text-brand-600 font-semibold">
            {step === 1 && 'Account Information'}
            {step === 2 && 'Doctor Category'}
            {step === 3 && 'Professional Credentials'}
            {step === 4 && 'Languages & Location'}
            {step === 5 && 'Verification Documents'}
            {step === 6 && 'Review & Submit'}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-teal-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 animate-in fade-in"
        >
          {errorMessage}
        </div>
      )}

      {/* FORM BODY */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-label="Doctor registration wizard">
        
        {/* STEP 1: ACCOUNT INFORMATION */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              1. Basic Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Dr. Alexander Fleming"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Username *"
                  placeholder="Enter unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  icon={<User className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Mobile Number *"
                  placeholder="+91 98765 43210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              <div>
                <PasswordInput
                  label="Password *"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <PasswordInput
                  label="Confirm Password *"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DOCTOR CATEGORY & SPECIALTY */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <DoctorTypeSelector
              doctorType={doctorType}
              selectedSpecialtyId={specialtyId}
              onDoctorTypeChange={setDoctorType}
              onSpecialtyChange={setSpecialtyId}
            />
          </div>
        )}

        {/* STEP 3: PROFESSIONAL CREDENTIALS */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              3. Professional Qualifications & Licensing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Medical Qualification *"
                  placeholder="e.g. MBBS, MD, MS, DM"
                  value={medicalQualification}
                  onChange={(e) => setMedicalQualification(e.target.value)}
                  required
                  icon={<Award className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Years of Experience *"
                  type="number"
                  min="0"
                  max="60"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                  icon={<Award className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Medical Registration / License Number *"
                  placeholder="e.g. MCI-123456"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Licensing / Registration Authority *"
                  placeholder="e.g. Medical Council of India / State Board"
                  value={licensingAuthority}
                  onChange={(e) => setLicensingAuthority(e.target.value)}
                  required
                  icon={<Award className="w-4 h-4" />}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Professional Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief description of your clinical background, areas of clinical interest, and patient care philosophy..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white text-slate-900 text-sm placeholder:text-slate-400 border border-slate-200 rounded-lg p-3 transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LANGUAGES, MODES & LOCATION */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              4. Consultation Preferences & Location
            </h3>

            {/* Languages Spoken */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Consultation Languages <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isChecked = selectedLanguages.includes(lang.code)

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageToggle(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isChecked
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lang.name} ({lang.nativeName})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Supported Consultation Modes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Supported Consultation Modes <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { mode: 'ONLINE_VIDEO' as ConsultationType, label: 'Video Call' },
                  { mode: 'ONLINE_AUDIO' as ConsultationType, label: 'Audio Call' },
                  { mode: 'OFFLINE' as ConsultationType, label: 'Offline Visit' },
                  { mode: 'CHAT' as ConsultationType, label: 'Secure Chat' },
                ].map((item) => {
                  const isChecked = consultationModes.includes(item.mode)

                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => handleConsultationModeToggle(item.mode)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        isChecked
                          ? 'bg-teal-50 border-teal-500 text-teal-900 ring-1 ring-teal-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="City *"
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Town / Locality"
                  placeholder="e.g. Bandra West"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="State / Region *"
                  placeholder="e.g. Maharashtra"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  icon={<Globe className="w-4 h-4" />}
                />
              </div>

              <div>
                <Input
                  label="Country *"
                  placeholder="e.g. India"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  icon={<Globe className="w-4 h-4" />}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENT UPLOAD FOUNDATION */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              5. Verification Document Upload (Foundation)
            </h3>
            <p className="text-xs text-slate-500">
              Upload clear copies of your medical degree, state registration license, and government ID proof for administrative verification.
            </p>

            <div className="space-y-4">
              {/* Qualification Certificate */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-900">Medical Qualification Certificate</span>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                </div>
                <label className="cursor-pointer bg-white px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-600" />
                  {qualificationCertName ? qualificationCertName : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setQualificationCertName)}
                  />
                </label>
              </div>

              {/* Medical License Document */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-900">Medical Registration License Document</span>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                </div>
                <label className="cursor-pointer bg-white px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-600" />
                  {licenseDocName ? licenseDocName : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setLicenseDocName)}
                  />
                </label>
              </div>

              {/* ID Proof */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-900">Identity Proof (Passport / National ID)</span>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG (Max 5MB)</p>
                </div>
                <label className="cursor-pointer bg-white px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-600" />
                  {idProofName ? idProofName : 'Choose File'}
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setIdProofName)}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & SUBMIT */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              6. Review Profile Details Before Submission
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 uppercase">Account Details</span>
                  <button type="button" onClick={() => setStep(1)} className="text-brand-600 font-semibold hover:underline">Edit</button>
                </div>
                <p><strong>Name:</strong> {fullName}</p>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Mobile:</strong> {mobileNumber}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 uppercase">Doctor Category</span>
                  <button type="button" onClick={() => setStep(2)} className="text-brand-600 font-semibold hover:underline">Edit</button>
                </div>
                <p><strong>Category:</strong> {doctorType === 'GENERAL_PHYSICIAN' ? 'General Physician' : 'Specialist'}</p>
                {doctorType === 'SPECIALIST' && <p><strong>Specialty ID:</strong> {specialtyId}</p>}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 uppercase">Credentials</span>
                  <button type="button" onClick={() => setStep(3)} className="text-brand-600 font-semibold hover:underline">Edit</button>
                </div>
                <p><strong>Qualification:</strong> {medicalQualification}</p>
                <p><strong>Experience:</strong> {experienceYears} Years</p>
                <p><strong>License Number:</strong> {licenseNumber}</p>
                <p><strong>Authority:</strong> {licensingAuthority}</p>
              </div>
            </div>

            {/* VERIFICATION REVIEW NOTICE */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Administrative Review Required:</strong> Your profile will be submitted with <strong>PENDING</strong> verification status. Platform administrators will review your qualifications before activating public consultation scheduling.
              </p>
            </div>
          </div>
        )}

        {/* STEP NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isSubmitting}
              onClick={handlePrevStep}
              className="gap-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNextStep}
              className="gap-2 font-semibold"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="teal"
              size="lg"
              disabled={isSubmitting}
              className="font-bold gap-2 shadow-lg shadow-teal-600/20 h-11"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting Registration...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  Submit Registration <CheckCircle className="w-4 h-4" />
                </span>
              )}
            </Button>
          )}
        </div>

      </form>

    </Card>
  )
}
