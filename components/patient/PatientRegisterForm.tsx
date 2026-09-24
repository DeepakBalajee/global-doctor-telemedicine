'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Calendar, Globe, MapPin, CheckCircle, UserCheck, ShieldCheck } from 'lucide-react'
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

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [otpMessage, setOtpMessage] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSendOtp = async () => {
    if (!mobileNumber.trim() || mobileNumber.trim().length < 8) {
      setErrorMessage('Please enter a valid mobile number before requesting SMS OTP.')
      return
    }

    setErrorMessage(null)
    setOtpMessage(null)
    setIsSendingOtp(true)

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: mobileNumber.trim(), role: 'PATIENT' }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsOtpSent(true)
        setOtpMessage(data.message || '6-digit OTP code sent successfully via SMS.')
      } else {
        setErrorMessage(data.error || data.message || 'Failed to send SMS OTP.')
      }
    } catch {
      setErrorMessage('Unable to connect to SMS service. Please try again.')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code received via SMS.')
      return
    }

    setErrorMessage(null)
    setOtpMessage(null)
    setIsVerifyingOtp(true)

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: mobileNumber.trim(),
          otpCode: otpCode.trim(),
          role: 'PATIENT',
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setIsPhoneVerified(true)
        setOtpMessage('✓ Phone number verified successfully via SMS OTP.')
      } else {
        setErrorMessage(data.error || data.message || 'Invalid or expired OTP code.')
      }
    } catch {
      setErrorMessage('Unable to verify OTP code. Please try again.')
    } finally {
      setIsVerifyingOtp(false)
    }
  }

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

    if (!isPhoneVerified) {
      setErrorMessage('Please request and verify the 6-digit SMS OTP sent to your phone number before creating your account.')
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
        window.location.href = result.redirectUrl
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
            Fill in your details and verify your phone number via SMS OTP to create your patient dashboard.
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

      {otpMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 animate-in fade-in flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {otpMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off" aria-label="Patient registration form">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Full Name *"
              placeholder="e.g. Anita Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          {/* MOBILE NUMBER WITH REALTIME SMS OTP VERIFICATION */}
          <div className="sm:col-span-2 space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-800">
              Mobile Phone Number * {isPhoneVerified && <span className="text-emerald-600 font-extrabold ml-2">✓ Verified via SMS</span>}
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="+91 98123 45678"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value)
                    setIsPhoneVerified(false)
                  }}
                  required
                  disabled={isLoading || isPhoneVerified}
                  autoComplete="off"
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              {!isPhoneVerified && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || isLoading || !mobileNumber.trim()}
                  className="shrink-0 text-xs font-bold border-brand-300 text-brand-700 bg-white hover:bg-brand-50"
                >
                  {isSendingOtp ? 'Sending SMS...' : isOtpSent ? 'Resend SMS OTP' : 'Send SMS OTP'}
                </Button>
              )}
            </div>

            {/* OTP VERIFICATION INPUT */}
            {isOtpSent && !isPhoneVerified && (
              <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-200/80 mt-2">
                <div className="flex-1">
                  <Input
                    placeholder="Enter 6-digit SMS OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    disabled={isLoading || isVerifyingOtp}
                  />
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || isLoading || otpCode.trim().length !== 6}
                  className="shrink-0 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
            )}
          </div>

          <div>
            <PasswordInput
              label="Password *"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="new-password"
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
              autoComplete="new-password"
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
          disabled={isLoading || !isPhoneVerified}
          className={`mt-4 font-bold text-sm h-11 shadow-lg ${isPhoneVerified ? 'shadow-brand-600/20 bg-brand-600' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
        >
          {isLoading ? 'Creating Patient Account & Dashboard...' : isPhoneVerified ? 'Create Account & Dashboard' : 'Verify Mobile Number to Create Account'}
        </Button>

      </form>

    </Card>
  )
}
