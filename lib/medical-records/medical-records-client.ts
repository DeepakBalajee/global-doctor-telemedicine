import { Prescription } from '@/types/prescription'
import { MedicalDocument } from '@/types/medical-record'

export async function fetchPatientMedicalRecords(): Promise<{
  prescriptions: Prescription[]
  documents: MedicalDocument[]
}> {
  try {
    const response = await fetch('/api/patient/medical-records')
    if (!response.ok) return { prescriptions: [], documents: [] }
    return await response.json()
  } catch {
    return { prescriptions: [], documents: [] }
  }
}

export async function fetchPrescriptionById(id: string): Promise<Prescription | null> {
  try {
    const response = await fetch(`/api/prescriptions/${id}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.prescription || null
  } catch {
    return null
  }
}

export async function createPrescription(payload: any): Promise<{ success: boolean; prescription?: Prescription; error?: string }> {
  try {
    const response = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to create prescription.' }
    return { success: true, prescription: data.prescription }
  } catch {
    return { success: false, error: 'Server connection error.' }
  }
}

export async function uploadMedicalDocument(payload: {
  documentType: string
  fileName: string
  mimeType: string
  fileSize: number
}): Promise<{ success: boolean; document?: MedicalDocument; error?: string }> {
  try {
    const response = await fetch('/api/medical-documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) return { success: false, error: data.error || 'Failed to upload document.' }
    return { success: true, document: data.document }
  } catch {
    return { success: false, error: 'Server connection error.' }
  }
}

export async function fetchSuperAdminPrescriptions(): Promise<Prescription[]> {
  try {
    const response = await fetch('/api/super-admin/prescriptions')
    if (!response.ok) return []
    const data = await response.json()
    return data.prescriptions || []
  } catch {
    return []
  }
}

export async function fetchSuperAdminDocuments(): Promise<MedicalDocument[]> {
  try {
    const response = await fetch('/api/super-admin/medical-documents')
    if (!response.ok) return []
    const data = await response.json()
    return data.documents || []
  } catch {
    return []
  }
}

export async function revokeSuperAdminPrescription(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/super-admin/prescriptions/${id}/revoke`, { method: 'POST' })
    return response.ok
  } catch {
    return false
  }
}
