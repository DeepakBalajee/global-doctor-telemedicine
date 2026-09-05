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

CREATE INDEX IF NOT EXISTS idx_transactions_patient ON financial_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_transactions_doctor ON financial_transactions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_appointment ON financial_transactions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payouts_doctor ON doctor_payouts(doctor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient ON financial_invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_doctor ON financial_invoices(doctor_id);
