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

CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctors_verification ON doctors(verification_status);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty_id);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors(city);
