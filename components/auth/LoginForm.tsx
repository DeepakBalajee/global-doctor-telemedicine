'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, UserPlus, Stethoscope, UserCheck } from 'lucide-react'
import { PasswordInput } from './PasswordInput'
import { AuthError } from './AuthError'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { loginWithCredentials } from '@/lib/auth/auth-client'
import { AuthResponseStatus } from '@/types/auth'

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return // Lock double submit

    setErrorMessage(null)

    if (!usernameOrEmail.trim()) {
      setErrorMessage('Please enter your username or email.')
      return
    }

    if (!password) {
      setErrorMessage('Please enter your password.')
      return
    }

    setIsLoading(true)

    try {
      const result = await loginWithCredentials({
        usernameOrEmail,
        password,
        rememberMe,
      })

      if (result.status === AuthResponseStatus.SUCCESS && result.user) {
        // Redirect based on backend authenticated user role
        router.push('/patient')
      } else {
        setErrorMessage(result.message || 'Invalid username or password.')
      }
    } catch {
      setErrorMessage('We couldn’t sign you in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl space-y-6">
      
      {/* CARD HEADER */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in securely to continue to your healthcare account.
        </p>
      </div>

      {/* ERROR BANNER */}
      <AuthError message={errorMessage || undefined} />

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Sign in form">
        
        {/* USERNAME OR EMAIL */}
        <Input
          label="Username or Email"
          placeholder="Enter your username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          autoComplete="username"
          required
          disabled={isLoading}
          icon={<UserCheck className="w-4 h-4" />}
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
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            Remember me
          </label>

          <Link
            href="/forgot-password"
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
          className="mt-2 font-semibold text-sm h-11"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing in...
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

      {/* SEPARATE ACCOUNT CREATION TRIGGERS */}
      <div className="space-y-2.5 pt-1">
        <Link href="/register" className="block w-full">
          <Button variant="outline" size="md" fullWidth className="text-xs font-semibold gap-2 justify-center">
            <UserPlus className="w-4 h-4 text-brand-600" /> Don’t have an account? Create Patient Account
          </Button>
        </Link>

        <Link href="/doctor/register" className="block w-full">
          <Button variant="ghost" size="md" fullWidth className="text-xs font-semibold text-teal-700 hover:bg-teal-50 hover:text-teal-800 gap-2 justify-center border border-teal-100">
            <Stethoscope className="w-4 h-4 text-teal-600" /> Join as a Doctor
          </Button>
        </Link>

        <div className="pt-2 text-center">
          <Link
            href="/consultation-request"
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 underline"
          >
            Or continue as guest to book a consultation →
          </Link>
        </div>
      </div>

      {/* SECURITY TRUST MESSAGE */}
      <div className="pt-2 text-center border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <Shield className="w-3.5 h-3.5 text-brand-600" /> Your account is protected with secure authentication.
      </div>

    </Card>
  )
}
