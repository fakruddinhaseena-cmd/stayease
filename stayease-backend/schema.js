require('dotenv').config();
const { pool } = require('./config/db');

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) UNIQUE,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20) DEFAULT 'tenant',
      firebase_uid VARCHAR(255),
      status VARCHAR(20) DEFAULT 'active',
      kyc_status VARCHAR(20) DEFAULT 'pending',
      photo_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      action VARCHAR(100),
      entity_type VARCHAR(50),
      ip_address VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tenant_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      property_id INTEGER,
      room_id INTEGER,
      check_in_date DATE,
      check_out_date DATE,
      monthly_rent DECIMAL(10,2)
    );
  `);
  console.log('✅ Tables created!');
  process.exit();
};

createTables().catch(e => { console.log('❌', e.message); process.exit(); });