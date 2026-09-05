'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import { DateRangeFilter } from '@/types/analytics'

export interface AnalyticsDateRangePickerProps {
  value: DateRangeFilter
  onChange: (range: DateRangeFilter) => void
}

export const AnalyticsDateRangePicker: React.FC<AnalyticsDateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const options: { label: string; range: DateRangeFilter }[] = [
    { label: 'All Time', range: 'ALL_TIME' },
    { label: 'Today', range: 'TODAY' },
    { label: 'Yesterday', range: 'YESTERDAY' },
    { label: 'Last 7 Days', range: 'LAST_7_DAYS' },
    { label: 'Last 30 Days', range: 'LAST_30_DAYS' },
    { label: 'This Month', range: 'THIS_MONTH' },
    { label: 'This Year', range: 'THIS_YEAR' },
  ]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200">
      <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 shrink-0" />
      {options.map((opt) => (
        <button
          key={opt.range}
          type="button"
          onClick={() => onChange(opt.range)}
          className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
            value === opt.range
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
