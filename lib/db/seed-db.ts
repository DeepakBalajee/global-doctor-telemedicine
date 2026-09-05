import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth/password'
import { randomUUID } from 'crypto'

export async function ensureDatabaseSeeded(): Promise<void> {
  try {
    // 1. Ensure migrations tables / schema exist
    await db.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT','DOCTOR','ADMIN','SUPER_ADMIN')),
        name VARCHAR(255),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(30),
        date_of_birth DATE NOT NULL,
        gender VARCHAR(30) NOT NULL,
        problem TEXT,
        preferred_language VARCHAR(100),
        city_town_village VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        mobile_number VARCHAR(50) NOT NULL,
        doctor_type VARCHAR(30) NOT NULL,
        specialty_id VARCHAR(100),
        specialty_name VARCHAR(255),
        medical_qualification VARCHAR(255) NOT NULL,
        experience_years INTEGER NOT NULL DEFAULT 0,
        license_number VARCHAR(255) NOT NULL UNIQUE,
        licensing_authority VARCHAR(255) NOT NULL,
        bio TEXT,
        languages JSONB NOT NULL DEFAULT '[]',
        consultation_modes JSONB NOT NULL DEFAULT '[]',
        city VARCHAR(255) NOT NULL,
        town VARCHAR(255),
        state VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
        account_status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL UNIQUE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('PATIENT','DOCTOR','ADMIN','SUPER_ADMIN')),
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        revoked_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS admin_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255),
        role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN','SUPER_ADMIN')),
        account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_by UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ
      );

      CREATE TABLE IF NOT EXISTS doctor_availability (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (doctor_id, day_of_week, start_time, end_time)
      );

      CREATE TABLE IF NOT EXISTS consultation_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
        specialty_id VARCHAR(100),
        consultation_type VARCHAR(30) NOT NULL,
        problem TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        preferred_time VARCHAR(20) NOT NULL,
        fee_inr NUMERIC(12,2) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT',
        patient_details JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        consultation_request_id UUID NOT NULL REFERENCES consultation_requests(id) ON DELETE CASCADE,
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        consultation_type VARCHAR(30) NOT NULL,
        problem TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        start_time VARCHAR(20) NOT NULL,
        end_time VARCHAR(20) NOT NULL,
        fee_inr NUMERIC(12,2) NOT NULL,
        payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
        appointment_status VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
        cancellation_reason TEXT,
        cancelled_by VARCHAR(20),
        timeline JSONB NOT NULL DEFAULT '[]',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS consultation_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        appointment_id UUID NOT NULL UNIQUE REFERENCES appointments(id) ON DELETE CASCADE,
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        consultation_type VARCHAR(30) NOT NULL,
        status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
        started_at TIMESTAMPTZ,
        ended_at TIMESTAMPTZ,
        duration_minutes INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS consultation_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        consultation_session_id UUID NOT NULL REFERENCES consultation_sessions(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender_name VARCHAR(255) NOT NULL,
        sender_role VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prescriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
        consultation_session_id UUID REFERENCES consultation_sessions(id) ON DELETE SET NULL,
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        diagnosis TEXT NOT NULL,
        clinical_notes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
        issued_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS prescription_medications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
        medicine_name VARCHAR(255) NOT NULL,
        dosage VARCHAR(255) NOT NULL,
        frequency VARCHAR(255) NOT NULL,
        duration VARCHAR(255) NOT NULL,
        instructions TEXT
      );

      CREATE TABLE IF NOT EXISTS medical_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        uploaded_by VARCHAR(20) NOT NULL,
        doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
        appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
        document_type VARCHAR(30) NOT NULL,
        file_name VARCHAR(500) NOT NULL,
        storage_key VARCHAR(1000) NOT NULL,
        mime_type VARCHAR(255) NOT NULL,
        file_size BIGINT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS financial_transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        payment_id VARCHAR(255),
        appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
        patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
        doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
        transaction_type VARCHAR(30) NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        status VARCHAR(30) NOT NULL,
        reference VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS doctor_payouts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
        payout_method VARCHAR(100) NOT NULL,
        provider_reference VARCHAR(255),
        requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        processed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS financial_invoices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        invoice_type VARCHAR(30) NOT NULL,
        reference_id VARCHAR(255) NOT NULL,
        patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
        doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
        appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
        amount NUMERIC(12,2) NOT NULL,
        platform_fee NUMERIC(12,2),
        doctor_earning NUMERIC(12,2),
        currency VARCHAR(10) NOT NULL DEFAULT 'INR',
        status VARCHAR(30) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipient_role VARCHAR(20) NOT NULL,
        notification_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        read_at TIMESTAMPTZ,
        deep_link VARCHAR(1000),
        metadata JSONB
      );

      CREATE TABLE IF NOT EXISTS notification_preferences (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        appointment_reminders BOOLEAN NOT NULL DEFAULT TRUE,
        payment_updates BOOLEAN NOT NULL DEFAULT TRUE,
        chat_notifications BOOLEAN NOT NULL DEFAULT TRUE,
        medical_updates BOOLEAN NOT NULL DEFAULT TRUE,
        security_alerts BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        actor_role VARCHAR(20) NOT NULL,
        action VARCHAR(255) NOT NULL,
        target_type VARCHAR(100),
        target_id VARCHAR(255),
        details TEXT,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(100),
        success BOOLEAN NOT NULL DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS security_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(100) NOT NULL,
        severity VARCHAR(20) NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(100),
        target_user VARCHAR(255)
      );
    `)

    // 2. Check if Super Admin exists in users table. If not, seed Super Admin.
    const saCheck = await db.query(
      `SELECT id FROM users WHERE role = 'SUPER_ADMIN' LIMIT 1`
    )

    if (saCheck.rows.length === 0) {
      const saUserId = randomUUID()
      const saAdminId = randomUUID()
      const saPasswordHash = await hashPassword('SuperAdmin@123')

      await db.query(
        `
        INSERT INTO users (id, username, email, password_hash, role, name, is_active)
        VALUES ($1, $2, $3, $4, 'SUPER_ADMIN', $5, true)
        `,
        [saUserId, 'superadmin', 'superadmin@globaltelemed.org', saPasswordHash, 'Global Platform Super Admin']
      )

      await db.query(
        `
        INSERT INTO admin_accounts (id, user_id, full_name, username, email, role, account_status)
        VALUES ($1, $2, $3, $4, $5, 'SUPER_ADMIN', 'ACTIVE')
        `,
        [saAdminId, saUserId, 'Global Platform Super Admin', 'superadmin', 'superadmin@globaltelemed.org']
      )
    }

    // 3. Seed initial Verified Doctor (Dr. Sarah Jenkins) if no doctors exist
    const docCheck = await db.query(`SELECT id FROM doctors LIMIT 1`)
    if (docCheck.rows.length === 0) {
      const docUserId = randomUUID()
      const docId = randomUUID()
      const docPasswordHash = await hashPassword('Doctor@123')

      await db.query(
        `
        INSERT INTO users (id, username, email, password_hash, role, name, is_active)
        VALUES ($1, $2, $3, $4, 'DOCTOR', $5, true)
        `,
        [docUserId, 'drsarah', 'sarah.jenkins@globaltelemed.org', docPasswordHash, 'Dr. Sarah Jenkins']
      )

      await db.query(
        `
        INSERT INTO doctors (
          id, user_id, full_name, username, email, mobile_number, doctor_type,
          specialty_id, specialty_name, medical_qualification, experience_years,
          license_number, licensing_authority, bio, languages, consultation_modes,
          city, state, country, verification_status, account_status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14, $15, $16,
          $17, $18, $19, 'VERIFIED', 'ACTIVE'
        )
        `,
        [
          docId,
          docUserId,
          'Dr. Sarah Jenkins',
          'drsarah',
          'sarah.jenkins@globaltelemed.org',
          '+91 98765 43210',
          'SPECIALIST',
          'cardiology',
          'Cardiology',
          'MD, FACC',
          12,
          'MCI-889012',
          'Medical Council of India',
          'Senior Cardiologist specializing in preventive heart health.',
          JSON.stringify(['English', 'Hindi']),
          JSON.stringify(['ONLINE_VIDEO', 'ONLINE_AUDIO']),
          'Mumbai',
          'Maharashtra',
          'India',
        ]
      )
    }

    // 4. Seed initial Patient (Anita Sharma) if no patients exist
    const patCheck = await db.query(`SELECT id FROM patients LIMIT 1`)
    if (patCheck.rows.length === 0) {
      const patUserId = randomUUID()
      const patId = randomUUID()
      const patPasswordHash = await hashPassword('Patient@123')

      await db.query(
        `
        INSERT INTO users (id, username, email, password_hash, role, name, is_active)
        VALUES ($1, $2, $3, $4, 'PATIENT', $5, true)
        `,
        [patUserId, 'anitasharma', 'anita.sharma@example.com', patPasswordHash, 'Anita Sharma']
      )

      await db.query(
        `
        INSERT INTO patients (
          id, user_id, full_name, mobile_number, date_of_birth, gender, problem, preferred_language, city_town_village
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          patId,
          patUserId,
          'Anita Sharma',
          '+91 91234 56789',
          '1992-05-15',
          'Female',
          'Chest discomfort and mild palpitations',
          'English',
          'Mumbai',
        ]
      )

      await db.query(
        `INSERT INTO notification_preferences (user_id) VALUES ($1) ON CONFLICT DO NOTHING`,
        [patUserId]
      )
    }
  } catch (err) {
    console.error('ensureDatabaseSeeded error:', err)
  }
}
