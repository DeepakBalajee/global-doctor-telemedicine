# Global Doctor Telemedicine Platform — Master Handover Documentation

## 1. Project Overview & Release Identification
- **Platform Name**: Global Doctor Appointment & Telemedicine Platform
- **Release Candidate Tag**: `v1.0.0-RC-PROD`
- **Build Status**: 100% Compiled (0 Errors, 0 Warnings across 143 Next.js App Router endpoints)
- **Consultation Fee**: Server-authoritative **₹5.00 INR** (500 paise)
- **Super Admin Constraint**: `COUNT(SUPER_ADMIN) <= 1` strictly enforced at DB and application layer.

---

## 2. Platform System Architecture

```
User (Browser / PWA)
      │
      ▼
HTTPS / WSS Reverse Proxy (NGINX / Caddy / AWS ALB)
      │
      ▼
Next.js 14 App Router Server Engine (Port 3000)
      │
      ├── Authentication & RBAC Guard Engine (JWT + HTTP-Only Cookies)
      ├── REST API Services (Doctors, Patients, Appointments, Payments, Medical Records)
      ├── Server-Authoritative Payment Engine (Razorpay Webhook Verification)
      └── WebRTC Private Video Consultation Signaling Protocol (WSS)
      │
      ▼
PostgreSQL Database Cluster (Port 5432 with SSL)
```

---

## 3. User Roles & RBAC Matrix

| Role | Permissions Scope | Single Super Admin Guard |
| :--- | :--- | :---: |
| `GUEST` | Unauthenticated doctor inspection, public pages | N/A |
| `PATIENT` | Book appointments, pay ₹5, view own medical records/prescriptions | N/A |
| `DOCTOR` | View assigned patient charts, issue prescriptions, join WebRTC call | N/A |
| `ADMIN` | Manage doctor verifications, view patient directory, operational search | N/A |
| `SUPER_ADMIN` | Master control console across all 14 modules, financial ledgers, system health | **EXACTLY 1** |

---

## 4. Environment Variables Template (`.env.production`)

```text
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://telemed.globaldoctor.org
NEXT_PUBLIC_API_BASE_URL=https://telemed.globaldoctor.org/api
DATABASE_URL=postgresql://telemed_user:your_secure_password_here@localhost:5432/telemed_db?sslmode=require
JWT_SECRET=min_32_character_random_hash_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here
NEXT_PUBLIC_VIDEO_SIGNALING_URL=wss://telemed.globaldoctor.org/signal
VIDEO_SERVICE_API_KEY=your_video_service_key_here
```

---

## 5. Operations & Troubleshooting Runbook

### Daily/Regular Checks
- **Liveness Probe**: `GET /api/health/liveness` -> Expect `200 OK`
- **Readiness Probe**: `GET /api/health/readiness` -> Expect `200 OK` with DB & env health
- **Super Admin Audit**: `GET /api/super-admin/security/audit` -> Expect 0 critical vulnerabilities

### Emergency Recovery Procedures
1. **Database Connection Interruption**:
   - Check PostgreSQL process status and verify SSL connection string (`sslmode=require`).
2. **WebRTC Signaling Drop**:
   - Verify reverse proxy (NGINX) includes `Upgrade` and `Connection` HTTP headers.
3. **Razorpay Webhook Delay**:
   - Webhook signatures auto-retry safely via idempotent transaction handling.

---

## 6. Final Deployment Status Decision

# **READY AFTER EXTERNAL CONFIGURATION**
