# Global Doctor Telemedicine Platform — Production Deployment Manual

This document outlines the step-by-step procedure to deploy the **Global Doctor Appointment & Telemedicine Platform** into a production environment.

---

## 1. Prerequisites

- **Runtime**: Node.js `v18.x` or `v20.x` LTS
- **Database**: PostgreSQL `v14+` with SSL mode enabled (`sslmode=require`)
- **Reverse Proxy**: NGINX, Caddy, or AWS Application Load Balancer (ALB) with SSL/TLS termination
- **Domain & SSL**: Valid FQDN (e.g. `telemed.globaldoctor.org`) with HTTPS certificate

---

## 2. Environment Setup

Copy `.env.example` to `.env.production` and configure secret variables:

```bash
cp .env.example .env.production
```

### Essential Environment Variables Matrix

| Variable | Description | Safe Example Placeholder |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `NEXT_PUBLIC_APP_URL` | Public application URL | `https://telemed.globaldoctor.org` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@db:5432/telemed?sslmode=require` |
| `JWT_SECRET` | 32+ char secret for JWT signatures | `random_32_char_hash_here` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_live_xxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay private secret key | `secret_xxx` |
| `NEXT_PUBLIC_VIDEO_SIGNALING_URL`| WSS WebRTC signaling URL | `wss://telemed.globaldoctor.org/signal` |

> [!CAUTION]
> Never commit `.env` or `.env.production` to source control. Secret keys must be loaded exclusively via environment variables or cloud secret managers.

---

## 3. Database Migration & Initialization

Run initial schema migrations to set up tables, indexes, and initial Super Admin seed constraints:

```bash
npm run db:migrate
```

### Verification Safeguard:
- Verify database constraint `COUNT(SUPER_ADMIN) <= 1` is active.
- Verify ₹5.00 INR consultation fee is enforced server-side.

---

## 4. Production Build & Startup

Compile Next.js production bundle and launch server:

```bash
npm run build
npm run start
```

---

## 5. Reverse Proxy & Health Checks

### NGINX Sample Configuration Snippet

```nginx
server {
    listen 443 ssl http2;
    server_name telemed.globaldoctor.org;

    ssl_certificate /etc/letsencrypt/live/telemed.globaldoctor.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/telemed.globaldoctor.org/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

### Health Check Probes
- **Liveness Probe**: `GET https://telemed.globaldoctor.org/api/health/liveness` (Returns `200 OK`)
- **Readiness Probe**: `GET https://telemed.globaldoctor.org/api/health/readiness` (Verifies DB, env config, payment verification)

---

## 6. Troubleshooting

- **503 Service Unavailable on `/api/health/readiness`**:
  - Check database connectivity and environment variable completeness.
- **WebSocket / WebRTC Signaling Drop**:
  - Ensure reverse proxy includes `Upgrade` and `Connection` HTTP headers.
