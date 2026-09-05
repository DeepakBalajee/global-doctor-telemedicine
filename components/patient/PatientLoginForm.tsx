'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, User, UserPlus, Eye, EyeOff } from 'lucide-react'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { AuthError } from '@/components/auth/AuthError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { loginPatientWithCredentials } from '@/lib/patient/patient-auth-client'

export const PatientLoginForm: React.FC = () => {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return

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
      const result = await loginPatientWithCredentials({
        usernameOrEmail: usernameOrEmail.trim(),
        password,
        rememberMe,
      })

      if (result.success && result.redirectUrl) {
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

  const handleContinueAsGuest = () => {
    router.push('/consultation-request')
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl space-y-6">
      
      {/* HEADER */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
          <User className="w-3.5 h-3.5 text-brand-600" /> Patient Portal
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight pt-1">
          Patient Login
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in to manage your appointments, consultations, and receipts.
        </p>
      </div>

      {/* ERROR BANNER */}
      <AuthError message={errorMessage || undefined} />

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Patient login form">
        
        <Input
          label="Username or Email"
          placeholder="Enter patient username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          autoComplete="username"
          required
          disabled={isLoading}
          icon={<User className="w-4 h-4 text-brand-600" />}
        />

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
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            Remember me
          </label>

          <Link
            href="/patient/forgot-password"
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="mt-2 font-bold text-sm h-11 shadow-lg shadow-brand-600/20"
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

      {/* GUEST ACCESS & ACCOUNT CREATION */}
      <div className="space-y-2.5 pt-1 text-center">
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleContinueAsGuest}
          className="text-xs font-semibold justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200"
        >
          Continue as Guest (Browse & Book)
        </Button>

        <Link href="/patient/register" className="block w-full">
          <Button variant="outline" size="md" fullWidth className="text-xs font-semibold gap-2 justify-center border-slate-300">
            <UserPlus className="w-4 h-4 text-brand-600" /> Don’t have an account? Create Patient Account
          </Button>
        </Link>

        <div className="pt-2">
          <Link href="/doctor/login" className="text-xs font-semibold text-slate-600 hover:text-teal-700 underline">
            Are you a doctor? Doctor Sign In →
          </Link>
        </div>
      </div>

      {/* SECURITY FOOTER */}
      <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-brand-600" /> Protected with secure authentication & IDOR privacy boundaries.
      </div>

    </Card>
  )
}
