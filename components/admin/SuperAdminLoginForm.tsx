'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Crown, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { superAdminLogin } from '@/lib/admin/admin-client'

export const SuperAdminLoginForm: React.FC = () => {
  const router = useRouter()
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    const result = await superAdminLogin({ usernameOrEmail, password })
    if (result.success) {
      router.push('/super-admin/dashboard')
    } else {
      setErrorMessage(result.message || 'Invalid username or password.')
    }

    setIsLoading(false)
  }

  return (
    <Card className="p-6 sm:p-8 border-slate-800 bg-slate-900 text-white shadow-2xl rounded-2xl max-w-md w-full mx-auto space-y-6">
      
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 mb-1">
          <Crown className="h-6 w-6 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Super Admin Console
        </h1>
        <p className="text-xs text-slate-400">
          Highest-privilege platform control console. Strictly guarded by COUNT(SUPER_ADMIN) &lt;= 1 safeguard.
        </p>
      </div>

      {errorMessage && (
        <div role="alert" className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-xs font-semibold text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Super Admin Username *
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="superadmin"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full text-xs p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-xs p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="font-bold text-xs gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
        >
          {isLoading ? 'Authenticating Super Admin...' : 'Authenticate Super Admin'} <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-800">
        <Link href="/admin/login" className="text-amber-400 font-semibold hover:underline">
          ← Standard Admin Head Login
        </Link>
      </div>

    </Card>
  )
}
