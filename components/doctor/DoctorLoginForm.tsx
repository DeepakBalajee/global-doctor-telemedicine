'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Stethoscope, UserCheck } from 'lucide-react'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { AuthError } from '@/components/auth/AuthError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { loginDoctorWithCredentials } from '@/lib/doctor/doctor-auth-client'

export const DoctorLoginForm: React.FC = () => {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return // Double-submit lock

    setErrorMessage(null)

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Please enter your username or email address.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const result = await loginDoctorWithCredentials({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
        rememberMe,
      })

      if (result.status === 'SUCCESS' && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else if (result.status === 'PENDING_VERIFICATION' && result.redirectUrl) {
        router.push(result.redirectUrl)
      } else {
        setErrorMessage(result.message || 'Invalid username/email or password.')
      }
    } catch {
      setErrorMessage('Unable to connect to the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl space-y-6">
      
      {/* CARD HEADER */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
          <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Doctor Portal
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
          Doctor Login
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in to access your professional doctor account.
        </p>
      </div>

      {/* ERROR BANNER */}
      <AuthError message={errorMessage || undefined} />

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Doctor login form">
        
        {/* USERNAME OR EMAIL */}
        <Input
          label="Username or Email"
          placeholder="Enter doctor username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          autoComplete="username"
          required
          disabled={isLoading}
          icon={<UserCheck className="w-4 h-4 text-teal-600" />}
        />

        {/* PASSWORD */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        {/* REMEMBER ME & FORGOT PASSWORD */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            Remember me
          </label>

          <Link
            href="/doctor/forgot-password"
            className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="teal"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="mt-2 font-bold text-sm h-11 shadow-lg shadow-teal-600/20"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing In...
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {/* DIVIDER */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-semibold">Or</span>
        </div>
      </div>

      {/* REGISTRATION & PATIENT LINKS */}
      <div className="space-y-2 pt-1 text-center">
        <Link href="/doctor/register" className="block w-full">
          <Button variant="outline" size="md" fullWidth className="text-xs font-semibold gap-2 justify-center border-slate-300">
            <Stethoscope className="w-4 h-4 text-teal-600" /> Don’t have an account? Register as Doctor
          </Button>
        </Link>

        <div className="pt-2">
          <Link href="/login" className="text-xs font-semibold text-slate-600 hover:text-brand-600 underline">
            Are you a patient? Patient Sign In →
          </Link>
        </div>
      </div>

      {/* SECURITY FOOTER */}
      <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-teal-600" /> Protected with secure authentication & role isolation.
      </div>

    </Card>
  )
}
