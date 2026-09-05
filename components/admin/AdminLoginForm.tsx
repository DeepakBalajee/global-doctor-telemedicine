'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { adminLogin } from '@/lib/admin/admin-client'

export const AdminLoginForm: React.FC = () => {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    const result = await adminLogin({ usernameOrEmail, password })
    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setErrorMessage(result.message || 'Invalid username or password.')
    }

    setIsLoading(false)
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-200 bg-white shadow-xl rounded-2xl max-w-md w-full mx-auto space-y-6">
      
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md shadow-teal-600/20 mb-1">
          <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Admin Head Sign In
        </h1>
        <p className="text-xs text-slate-500">
          Enter your authorized administrator credentials to access the platform control panel.
        </p>
      </div>

      {errorMessage && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Admin Username or Email *"
          placeholder="e.g. admin_head_1"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          icon={<User className="w-4 h-4 text-slate-400" />}
          required
        />

        <Input
          label="Password *"
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="w-4 h-4 text-slate-400" />}
          required
        />

        <Button
          type="submit"
          variant="teal"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="font-bold text-xs gap-2 shadow-lg shadow-teal-600/20"
        >
          {isLoading ? 'Authenticating Admin...' : 'Sign In as Admin'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-100 space-y-1">
        <p>No public admin registration. Accounts managed by Super Admin.</p>
        <p>
          <Link href="/super-admin/login" className="text-teal-700 font-semibold hover:underline">
            Super Admin Sign In →
          </Link>
        </p>
      </div>

    </Card>
  )
}
