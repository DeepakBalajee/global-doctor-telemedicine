import { Metadata } from 'next'
import { DoctorDashboardLayout } from '@/components/doctor/dashboard/DoctorDashboardLayout'
import { getPrescriptionById } from '@/lib/medical-records/prescription-store'
import { PrescriptionDocumentView } from '@/components/prescriptions/PrescriptionDocumentView'

export const metadata: Metadata = {
  title: 'Prescription Viewer | Doctor Workstation',
  description: 'View issued digital prescription.',
}

export default async function DoctorPrescriptionPage({
  params,
}: {
  params: { prescriptionId: string }
}) {
  const item = await getPrescriptionById(params.prescriptionId)

  if (!item) {
    return (
      <DoctorDashboardLayout>
        <div className="p-8 max-w-md mx-auto bg-white border border-red-200 rounded-2xl shadow-xl text-center space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">Prescription Not Found</h2>
          <p className="text-xs text-slate-600">The requested prescription ID does not exist or you do not have permission to view it.</p>
        </div>
      </DoctorDashboardLayout>
    )
  }

  return (
    <DoctorDashboardLayout>
      <PrescriptionDocumentView prescription={item} returnUrl="/doctor/appointments" />
    </DoctorDashboardLayout>
  )
}
