import type { Metadata, Viewport } from 'next'
import './globals.css'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Global Doctor Appointment & Telemedicine Platform',
  description:
    'Find verified specialist doctors, book online appointments, track real-time queue position, and consult securely via browser video calls.',
  keywords: [
    'doctor appointment',
    'telemedicine',
    'online doctor consultation',
    'virtual healthcare',
    'smart queue',
    'digital prescriptions',
    'specialist doctors',
  ],
  authors: [{ name: 'Global Doctor Telemedicine Team' }],
  openGraph: {
    title: 'Global Doctor Appointment & Telemedicine Platform',
    description:
      'Find verified specialist doctors, book online appointments, track real-time queue position, and consult securely online.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Global Doctor Telemedicine',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#026fc7',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased font-sans">
        <QueryProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
