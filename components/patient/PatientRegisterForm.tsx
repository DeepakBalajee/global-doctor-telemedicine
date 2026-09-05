'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Lock, Calendar, Globe, MapPin, CheckCircle, ArrowRight, UserCheck } from 'lucide-react'
import { GenderOption } from '@/types/patient'
import { SUPPORTED_LANGUAGES } from '@/data/languages'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { registerPatientAccount } from '@/lib/patient/patient-auth-client'

export const PatientRegisterForm: React.FC = () => {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<GenderOption>('MALE')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [city, setCity] = useState('')
  const [town, setTown] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    setErrorMessage(null)

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !mobileNumber.trim() ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !city.trim()
    ) {
      setErrorMessage('Please fill in all required registration fields.')
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

    setIsLoading(true)

    try {
      const result = await registerPatientAccount({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        password,
        dateOfBirth,
        gender,
        preferredLanguage,
        city: city.trim(),
        town: town.trim(),
      })

      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else {
        setErrorMessage(result.error || 'Failed to create patient account.')
      }
    } catch {
      setErrorMessage('We couldn’t create your account right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'NON_BINARY', label: 'Non-Binary' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Prefer Not to Say' },
  ]

  const languageOptions = SUPPORTED_LANGUAGES.map((l) => ({
    value: l.code,
    label: `${l.name} (${l.nativeName})`,
  }))

  return (
    <Card className="p-6 sm:p-10 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-2xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
            <User className="w-3.5 h-3.5 text-brand-600" /> Patient Registration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Create Patient Account
          </h1>
          <p className="text-xs text-slate-500">
            Register to manage appointments, track consultation status, and access ₹5 receipts.
          </p>
        </div>

        <Link
          href="/patient/login"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50/80 px-3 py-2 rounded-lg border border-brand-200 transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" /> Already registered? Sign In
        </Link>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 animate-in fade-in"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Patient registration form">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Name *"
              placeholder="e.g. Anita Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <div>
            <Input
              label="Email Address *"
              type="email"
              placeholder="patient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Mobile Number *"
              placeholder="+91 98123 45678"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div>
            <PasswordInput
              label="Confirm Password *"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              label="Date of Birth *"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={isLoading}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <div>
            <Select
              label="Gender *"
              options={genderOptions}
              value={gender}
              onChange={(e) => setGender(e.target.value as GenderOption)}
              disabled={isLoading}
              icon={<User className="w-4 h-4 text-slate-500" />}
            />
          </div>

          <div>
            <Select
              label="Preferred Language *"
              options={languageOptions}
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              disabled={isLoading}
              icon={<Globe className="w-4 h-4 text-slate-500" />}
            />
          </div>

          <div>
            <Input
              label="City / Town / Village *"
              placeholder="e.g. Delhi"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isLoading}
              icon={<MapPin className="w-4 h-4" />}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="mt-4 font-bold text-sm h-11 shadow-lg shadow-brand-600/20"
        >
          {isLoading ? 'Creating Patient Account...' : 'Create Account'}
        </Button>

      </form>

    </Card>
  )
}
