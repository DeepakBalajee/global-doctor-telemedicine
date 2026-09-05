import { UserRole } from './auth'

export type AccountStatus = 'ACTIVE' | 'SUSPENDED'

export interface AdminAccount {
  id: string
  userId: string
  fullName: string
  username: string
  email?: string
  role: UserRole.ADMIN | UserRole.SUPER_ADMIN
  accountStatus: AccountStatus
  createdBy?: string
  createdAt: string
  lastLoginAt?: string
}

export interface AuditLogEntry {
  id: string
  actorUserId: string
  actorRole: UserRole
  action: string
  targetType?: string
  targetId?: string
  details?: string
  timestamp: string
  ipAddress?: string
  success: boolean
}

export interface AdminDashboardData {
  totalDoctors: number
  activeDoctors: number
  pendingDoctors: number
  totalPatients: number
  todayAppointments: number
  upcomingAppointments: number
  completedAppointments: number
  cancelledAppointments: number
}

export interface SecurityEvent {
  id: string
  eventType: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  timestamp: string
  ipAddress?: string
  targetUser?: string
}

export interface SystemHealthStatus {
  serviceName: string
  status: 'HEALTHY' | 'DEGRADED' | 'UNAVAILABLE'
  latencyMs?: number
  lastCheckedAt: string
}

export interface SuperAdminDashboardData extends AdminDashboardData {
  suspendedDoctors: number
  totalAdmins: number
  activeAdmins: number
  totalPayments: number
  successfulPayments: number
  failedPayments: number
}
