import React from 'react'
import { AlertCircle } from 'lucide-react'

export interface AuthErrorProps {
  message?: string
}

export const AuthError: React.FC<AuthErrorProps> = ({ message }) => {
  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200/90 p-4 text-xs font-medium text-red-800 animate-in fade-in duration-200"
    >
      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <span className="leading-relaxed">{message}</span>
    </div>
  )
}
