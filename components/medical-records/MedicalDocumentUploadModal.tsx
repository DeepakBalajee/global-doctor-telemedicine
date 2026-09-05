'use client'

import React, { useState } from 'react'
import { Upload, X, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react'
import { MedicalDocumentType } from '@/types/medical-record'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { uploadMedicalDocument } from '@/lib/medical-records/medical-records-client'

export interface MedicalDocumentUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: () => void
}

export const MedicalDocumentUploadModal: React.FC<MedicalDocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [fileName, setFileName] = useState('')
  const [documentType, setDocumentType] = useState<MedicalDocumentType>('LAB_REPORT')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName.trim()) {
      setError('Please specify a document filename.')
      return
    }

    setError(null)
    setIsUploading(true)

    const res = await uploadMedicalDocument({
      documentType,
      fileName: fileName.trim().endsWith('.pdf') ? fileName.trim() : `${fileName.trim()}.pdf`,
      mimeType: 'application/pdf',
      fileSize: 1572864, // 1.5MB
    })

    if (res.success) {
      onUploadSuccess()
      onClose()
    } else {
      setError(res.error || 'Failed to upload document.')
    }

    setIsUploading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <Card className="p-6 max-w-md w-full bg-white border-slate-200 rounded-2xl space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-extrabold text-slate-900">Upload Medical Document</h3>
          </div>

          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Document Title / File Name *"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. Blood_Test_Report_Sept_2026"
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Document Type *</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as MedicalDocumentType)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              <option value="LAB_REPORT">Lab Diagnostic Report</option>
              <option value="IMAGING">Imaging (X-Ray / MRI / Scan)</option>
              <option value="PAST_PRESCRIPTION">Past Prescription</option>
              <option value="GENERAL">General Medical Document</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-1">
            <FileText className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">Select File (PDF, JPG, PNG)</p>
            <p className="text-[11px] text-slate-400">Maximum file size: 10MB. Executables blocked.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs font-semibold">
              Cancel
            </Button>

            <Button
              type="submit"
              variant="teal"
              size="sm"
              disabled={isUploading}
              className="text-xs font-bold gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
