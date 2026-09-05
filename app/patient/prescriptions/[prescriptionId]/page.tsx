import { Metadata } from 'next'
import { getPrescriptionById } from '@/lib/medical-records/prescription-store'
import { PrescriptionDocumentView } from '@/components/prescriptions/PrescriptionDocumentView'

export const metadata: Metadata = {
  title: 'Official Digital Prescription | Patient Portal',
  description: 'View and print official digital health prescription.',
}

export default async function PatientPrescriptionPage({
  params,
}: {
  params: { prescriptionId: string }
}) {
  const item = await getPrescriptionById(params.prescriptionId)

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="p-8 max-w-md w-full bg-white border border-red-200 rounded-2xl shadow-xl text-center space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">Prescription Not Found</h2>
          <p className="text-xs text-slate-600">The requested prescription ID does not exist or you do not have permission to view it.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PrescriptionDocumentView prescription={item} returnUrl="/patient/medical-records" />
    </div>
  )
}
