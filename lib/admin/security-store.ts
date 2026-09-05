import { SecurityEvent, SystemHealthStatus } from '@/types/admin'

const securityEventsStore: SecurityEvent[] = [
  {
    id: 'SEC-801',
    eventType: 'FAILED_LOGIN_ATTEMPT',
    severity: 'MEDIUM',
    description: 'Repeated failed login attempt recorded for non-existent admin user.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ipAddress: '192.168.1.45',
    targetUser: 'unknown_admin',
  },
  {
    id: 'SEC-802',
    eventType: 'ROLE_ESCALATION_PREVENTED',
    severity: 'HIGH',
    description: 'Blocked unauthorized payload attempt to inject role=SUPER_ADMIN.',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    ipAddress: '10.0.0.12',
    targetUser: 'dr_jenkins',
  },
]

export function getSecurityEvents(): SecurityEvent[] {
  return [...securityEventsStore]
}

export function logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
  const newEvent: SecurityEvent = {
    id: 'SEC-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
    timestamp: new Date().toISOString(),
    ...event,
  }
  securityEventsStore.unshift(newEvent)
  return newEvent
}

export function getSystemHealthStatus(): SystemHealthStatus[] {
  return [
    {
      serviceName: 'Core REST API Engine',
      status: 'HEALTHY',
      latencyMs: 14,
      lastCheckedAt: new Date().toISOString(),
    },
    {
      serviceName: 'PostgreSQL Database Cluster',
      status: 'HEALTHY',
      latencyMs: 8,
      lastCheckedAt: new Date().toISOString(),
    },
    {
      serviceName: 'HMAC Authentication Guard',
      status: 'HEALTHY',
      latencyMs: 5,
      lastCheckedAt: new Date().toISOString(),
    },
    {
      serviceName: 'Razorpay Payment Verification API',
      status: 'HEALTHY',
      latencyMs: 45,
      lastCheckedAt: new Date().toISOString(),
    },
  ]
}
