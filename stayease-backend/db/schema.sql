-- ══════════════════════════════════════════════════════════════
-- STAYEASE — Complete Database Schema
-- Run this in Supabase SQL Editor: 
-- https://supabase.com → Your Project → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE,
  phone       VARCHAR(15) UNIQUE NOT NULL,
  password    VARCHAR(255),
  role        VARCHAR(20) NOT NULL CHECK (role IN ('tenant','owner','admin','staff','manager')),
  status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','suspended','pending')),
  kyc_status  VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  photo_url   VARCHAR(500),
  firebase_uid VARCHAR(128) UNIQUE,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- ─── PROPERTIES ───────────────────────────────────────────────
CREATE TABLE properties (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  type         VARCHAR(30) NOT NULL CHECK (type IN ('PG','Co-Living','Hostel','Apartment')),
  gender       VARCHAR(20) NOT NULL CHECK (gender IN ('Male','Female','Any')),
  city         VARCHAR(100) NOT NULL,
  locality     VARCHAR(150) NOT NULL,
  address      TEXT NOT NULL,
  pincode      VARCHAR(10),
  latitude     DECIMAL(10,8),
  longitude    DECIMAL(11,8),
  monthly_rent INTEGER NOT NULL,
  security_deposit INTEGER,
  status       VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','inactive','pending_approval','rejected')),
  approval_status VARCHAR(20) DEFAULT 'pending',
  rating       DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  amenities    TEXT[],
  rules        TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- ─── PROPERTY IMAGES ──────────────────────────────────────────
CREATE TABLE property_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url   VARCHAR(500) NOT NULL,
  is_primary  BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── PROPERTY FEATURES ────────────────────────────────────────
CREATE TABLE property_features (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id         UUID REFERENCES properties(id) ON DELETE CASCADE UNIQUE,
  water_supply        BOOLEAN DEFAULT false,
  power_backup        BOOLEAN DEFAULT false,
  wifi                BOOLEAN DEFAULT false,
  lift                BOOLEAN DEFAULT false,
  parking             VARCHAR(50),
  cctv                BOOLEAN DEFAULT false,
  security_guard      BOOLEAN DEFAULT false,
  gated_community     BOOLEAN DEFAULT false,
  visitor_management  BOOLEAN DEFAULT false,
  fire_safety         BOOLEAN DEFAULT false,
  attached_washroom   BOOLEAN DEFAULT false,
  hot_water           BOOLEAN DEFAULT false,
  ac                  BOOLEAN DEFAULT false,
  wardrobe            BOOLEAN DEFAULT false,
  study_table         BOOLEAN DEFAULT false,
  balcony             BOOLEAN DEFAULT false,
  washing_machine     BOOLEAN DEFAULT false,
  water_purifier      BOOLEAN DEFAULT false,
  internet_speed      VARCHAR(50),
  near_metro          VARCHAR(50),
  mobile_signal       VARCHAR(30)
);

-- ─── ROOMS ────────────────────────────────────────────────────
CREATE TABLE rooms (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id  UUID REFERENCES properties(id) ON DELETE CASCADE,
  room_number  VARCHAR(20) NOT NULL,
  floor        INTEGER DEFAULT 1,
  type         VARCHAR(30) NOT NULL CHECK (type IN ('Single','Double','Triple','Four Sharing')),
  monthly_rent INTEGER NOT NULL,
  status       VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','occupied','maintenance','reserved','blocked')),
  description  TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- ─── BEDS ─────────────────────────────────────────────────────
CREATE TABLE beds (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id      UUID REFERENCES rooms(id) ON DELETE CASCADE,
  bed_number   VARCHAR(10) NOT NULL,
  status       VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available','occupied','reserved','maintenance')),
  tenant_id    UUID REFERENCES users(id),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ─── TENANT PROFILES ──────────────────────────────────────────
CREATE TABLE tenant_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  property_id       UUID REFERENCES properties(id),
  room_id           UUID REFERENCES rooms(id),
  bed_id            UUID REFERENCES beds(id),
  check_in_date     DATE,
  check_out_date    DATE,
  monthly_rent      INTEGER,
  security_deposit  INTEGER,
  lock_in_months    INTEGER DEFAULT 11,
  occupation        VARCHAR(100),
  company_college   VARCHAR(150),
  emergency_contact VARCHAR(15),
  emergency_name    VARCHAR(100),
  aadhaar_number    VARCHAR(20),
  pan_number        VARCHAR(15),
  aadhaar_url       VARCHAR(500),
  pan_url           VARCHAR(500),
  photo_url         VARCHAR(500),
  address           TEXT,
  is_blacklisted    BOOLEAN DEFAULT false,
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ─── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES users(id),
  property_id     UUID REFERENCES properties(id),
  room_id         UUID REFERENCES rooms(id),
  amount          INTEGER NOT NULL,
  payment_type    VARCHAR(30) NOT NULL CHECK (payment_type IN ('rent','deposit','advance','maintenance','late_fee')),
  payment_method  VARCHAR(30) CHECK (payment_method IN ('UPI','Card','Net Banking','Cash','Bank Transfer')),
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded','overdue')),
  month_year      VARCHAR(20),
  due_date        DATE,
  paid_date       TIMESTAMP,
  invoice_number  VARCHAR(50),
  transaction_id  VARCHAR(100),
  late_fee        INTEGER DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ─── SERVICE REQUESTS ─────────────────────────────────────────
CREATE TABLE service_requests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID REFERENCES users(id),
  property_id     UUID REFERENCES properties(id),
  room_id         UUID REFERENCES rooms(id),
  category        VARCHAR(50) NOT NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  priority        VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status          VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open','assigned','in_progress','resolved','closed','cancelled')),
  assigned_to     UUID REFERENCES users(id),
  photo_url       VARCHAR(500),
  resolved_at     TIMESTAMP,
  sla_hours       INTEGER DEFAULT 24,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── STAFF ────────────────────────────────────────────────────
CREATE TABLE staff (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id),
  property_id   UUID REFERENCES properties(id),
  role          VARCHAR(50) NOT NULL CHECK (role IN ('manager','warden','cleaner','cook','security','electrician','plumber')),
  salary        INTEGER NOT NULL,
  join_date     DATE DEFAULT CURRENT_DATE,
  status        VARCHAR(20) DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── STAFF ATTENDANCE ─────────────────────────────────────────
CREATE TABLE staff_attendance (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id    UUID REFERENCES staff(id),
  date        DATE NOT NULL,
  status      VARCHAR(20) CHECK (status IN ('present','absent','half_day','leave')),
  in_time     TIME,
  out_time    TIME,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── INVENTORY ────────────────────────────────────────────────
CREATE TABLE inventory (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id     UUID REFERENCES properties(id),
  item_name       VARCHAR(100) NOT NULL,
  category        VARCHAR(50),
  total_qty       INTEGER DEFAULT 0,
  allocated_qty   INTEGER DEFAULT 0,
  damaged_qty     INTEGER DEFAULT 0,
  purchase_date   DATE,
  purchase_cost   INTEGER,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─── VISITORS ─────────────────────────────────────────────────
CREATE TABLE visitors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  tenant_id   UUID REFERENCES users(id),
  name        VARCHAR(100) NOT NULL,
  phone       VARCHAR(15),
  purpose     VARCHAR(200),
  in_time     TIMESTAMP DEFAULT NOW(),
  out_time    TIMESTAMP,
  status      VARCHAR(20) DEFAULT 'inside' CHECK (status IN ('pending_approval','inside','checked_out','rejected')),
  photo_url   VARCHAR(500),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── FOOD MENU ────────────────────────────────────────────────
CREATE TABLE food_menu (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  day_of_week VARCHAR(20) NOT NULL,
  meal_type   VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner')),
  menu_items  TEXT NOT NULL,
  week_number INTEGER DEFAULT 1,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── ANNOUNCEMENTS ────────────────────────────────────────────
CREATE TABLE announcements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  created_by  UUID REFERENCES users(id),
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info','warning','event','urgent')),
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── KYC DOCUMENTS ────────────────────────────────────────────
CREATE TABLE kyc_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  doc_type    VARCHAR(30) NOT NULL CHECK (doc_type IN ('aadhaar','pan','passport','other')),
  doc_number  VARCHAR(50),
  doc_url     VARCHAR(500),
  status      VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','verified','rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(30) DEFAULT 'info',
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── AUDIT LOGS ───────────────────────────────────────────────
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  details     JSONB,
  ip_address  VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ─── AGREEMENTS ───────────────────────────────────────────────
CREATE TABLE agreements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id         UUID REFERENCES users(id),
  property_id       UUID REFERENCES properties(id),
  room_id           UUID REFERENCES rooms(id),
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  monthly_rent      INTEGER NOT NULL,
  security_deposit  INTEGER NOT NULL,
  notice_period     INTEGER DEFAULT 30,
  lock_in_months    INTEGER DEFAULT 11,
  terms             TEXT,
  doc_url           VARCHAR(500),
  status            VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','terminated')),
  signed_at         TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase ON users(firebase_uid);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_beds_room ON beds(room_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_service_requests_property ON service_requests(property_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tenant_profiles_updated_at BEFORE UPDATE ON tenant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── DEFAULT SUPER ADMIN ──────────────────────────────────────
-- Password: Admin@2026 (bcrypt hashed — change after first login)
INSERT INTO users (name, email, phone, password, role, status, kyc_status) VALUES
('Super Admin', 'admin@stayease.in', '9999999999', '$2b$10$rOGbKkAGmXoGPzFH4e2T0.PNDFmSTFLFBIMz5wqq4YFOvlc9YYKQO', 'admin', 'active', 'verified');
