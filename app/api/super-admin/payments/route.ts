import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const superAdminCookie = cookieStore.get('telemed_super_admin_session')

  if (!superAdminCookie) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  // Safe payment transaction receipts (Secrets & raw card data excluded)
  const paymentsList = [
    {
      id: 'PAY-TXN-99101',
      orderId: 'ORDER-RZP-99101',
      paymentId: 'pay_Preview99101Token',
      consultationRequestId: 'REQ-PREVIEW-101',
      patientId: 'PAT-88190',
      patientName: 'Anita Sharma',
      doctorId: 'DOC-101',
      doctorName: 'Dr. Sarah Jenkins',
      amountInINR: 5.0,
      status: 'PAID',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'PAY-TXN-88012',
      orderId: 'ORDER-RZP-88012',
      paymentId: 'pay_Preview88012Token',
      consultationRequestId: 'REQ-PREVIEW-088',
      patientId: 'PAT-88190',
      patientName: 'Anita Sharma',
      doctorId: 'DOC-102',
      doctorName: 'Dr. Rajesh Kumar',
      amountInINR: 5.0,
      status: 'PAID',
      createdAt: new Date(Date.now() - 864000000).toISOString(),
    },
  ]

  return NextResponse.json(paymentsList, { status: 200 })
}
