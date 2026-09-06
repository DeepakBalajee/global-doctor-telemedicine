'use client'

import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { requestPatientPasswordReset } from '@/lib/patient/patient-auth-client'

export default function GeneralForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resultMessage, setResultMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isLoading) return
    if (!email.trim() || !email.includes('@')) {
      setResultMessage('Please enter a valid email address.')
      return
    }

    setIsLoading(true)
    setResultMessage(null)

    try {
      const res = await requestPatientPasswordReset(email)
      setIsSuccess(res.success)
      setResultMessage(res.message || 'Password reset instructions sent to your email.')
    } catch {
      setResultMessage('Unable to process request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="p-6 sm:p-8 border-slate-200/90 shadow-elevated bg-white rounded-2xl max-w-md w-full space-y-6">
        
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
            <KeyRound className="h-6 w-6 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Password Reset
          </h1>
          <p className="text-xs text-slate-500">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {resultMessage && (
          <div
            role="alert"
            className={`p-4 rounded-xl text-xs font-semibold ${
              isSuccess
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
            <span>{resultMessage}</span>
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Registered Email *"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              icon={<Mail className="w-4 h-4 text-brand-600" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isLoading}
              className="font-bold text-xs h-11"
            >
              {isLoading ? 'Sending Request...' : 'Send Reset Instructions'}
            </Button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-slate-100">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

      </Card>
    </div>
  )
}
