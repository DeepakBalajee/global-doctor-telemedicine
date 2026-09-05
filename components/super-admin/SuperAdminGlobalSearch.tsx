'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, User, Stethoscope, Calendar, FileText, CreditCard, ShieldCheck, ArrowRight } from 'lucide-react'
import { SuperAdminSearchResult, SuperAdminSearchResultCategory } from '@/types/super-admin'
import { searchSuperAdminMaster } from '@/lib/super-admin/super-admin-client'

export const SuperAdminGlobalSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SuperAdminSearchResultCategory>('ALL')
  const [results, setResults] = useState<SuperAdminSearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      const res = await searchSuperAdminMaster(query, category)
      setResults(res)
      setIsLoading(false)
      setIsOpen(true)
    }, 250)

    return () => clearTimeout(timer)
  }, [query, category])

  const getIcon = (type: SuperAdminSearchResultCategory) => {
    switch (type) {
      case 'PATIENT':
        return <User className="w-4 h-4 text-emerald-600" />
      case 'DOCTOR':
        return <Stethoscope className="w-4 h-4 text-teal-600" />
      case 'APPOINTMENT':
        return <Calendar className="w-4 h-4 text-brand-600" />
      case 'PRESCRIPTION':
        return <FileText className="w-4 h-4 text-purple-600" />
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600" />
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      
      {/* SEARCH INPUT */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Global Master Search (Patient, Doctor, Appt #, Rx #, Payment ID)..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent focus:outline-none transition-all shadow-xs"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* RESULTS POPOVER */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-96 overflow-y-auto">
          
          {/* CATEGORY TABS */}
          <div className="p-2 bg-slate-50 flex items-center gap-1 overflow-x-auto text-[11px] font-bold border-b border-slate-200">
            {(['ALL', 'PATIENT', 'DOCTOR', 'APPOINTMENT', 'PRESCRIPTION'] as SuperAdminSearchResultCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    category === cat
                      ? 'bg-amber-500 text-white font-extrabold'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* RESULTS LIST */}
          {isLoading ? (
            <div className="p-6 text-center text-xs text-slate-400">Searching master database...</div>
          ) : results.length > 0 ? (
            <div className="p-2 space-y-1">
              {results.map((res) => (
                <Link
                  key={res.type + res.id}
                  href={res.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-amber-100 transition-colors">
                      {getIcon(res.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{res.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {res.status && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {res.status}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">No matching master resources found.</div>
          )}

        </div>
      )}

    </div>
  )
}
