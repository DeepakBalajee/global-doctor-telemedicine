import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg shadow-sm active:scale-[0.99]'

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 shadow-md border border-brand-600',
      secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10 shadow-md',
      outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 shadow-none',
      teal: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 shadow-md border border-teal-600',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs tracking-wide',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3.5 text-base font-semibold',
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
