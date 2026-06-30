const bcrypt    = require('bcryptjs');
const nodemailer = require('nodemailer');
const { pool }  = require('../config/db');
const { verifyFirebaseToken } = require('../config/firebase');
const { generateToken } = require('../middleware/auth');

// ─── EMAIL TRANSPORTER ────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT || '465'),
  secure: parseInt(process.env.EMAIL_PORT || '465') === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// In-memory OTP store  { email → { otp, expiresAt } }
// For production use Redis; this is fine for small deployments
const emailOtpStore = {};

// ─── HELPER: send email ───────────────────────────────────────
async function sendMail({ to, subject, html }) {
  if (!process.env.EMAIL_USER) return; // skip if not configured
  try {
    await transporter.sendMail({
      from: `"StayEase" <${process.env.EMAIL_USER}>`,
      to, subject, html,
    });
  } catch (err) {
    console.error('Mail send error:', err.message);
  }
}

// ─── HELPER: welcome email ────────────────────────────────────
async function sendWelcomeEmail({ name, email, role }) {
  const roleLabel = role === 'owner' ? 'Property Owner' : role === 'admin' ? 'Super Admin' : 'Tenant';
  await sendMail({
    to: email,
    subject: '🎉 Welcome to StayEase!',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;background:#04020f;padding:40px 20px;color:#fff;">
        <div style="max-width:500px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;">
          <div style="font-family:monospace;font-size:22px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:3px;margin-bottom:24px;">STAYEASE</div>
          <h2 style="color:#fff;margin:0 0 8px;">Welcome, ${name}! 🎉</h2>
          <p style="color:rgba(255,255,255,0.55);font-size:14px;margin:0 0 24px;">Your account has been created successfully as a <strong style="color:#a78bfa;">${roleLabel}</strong>.</p>
          <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:16px;margin-bottom:24px;">
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);">You can now log in using your registered email or phone number with OTP verification.</p>
          </div>
          <p style="font-size:12px;color:rgba(255,255,255,0.25);margin:0;">If you did not create this account, please ignore this email.</p>
        </div>
      </div>
    `,
  });
}

// ─── REGISTER (email + password + phone) ─────────────────────
const register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password, role } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // Check duplicate
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );
    if (existing.rows.length) {
      return res.status(409).json({ success: false, message: 'An account with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName.trim()} ${lastName.trim()}`;

    const result = await pool.query(
      `INSERT INTO users (name, phone, email, password, role, status, kyc_status)
       VALUES ($1, $2, $3, $4, $5, 'active', 'pending')
       RETURNING id, name, phone, email, role, status, kyc_status`,
      [name, phone, email.toLowerCase(), hashedPassword, role || 'tenant']
    );
    const user = result.rows[0];

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, 'user_registered', 'user', $2)`,
      [user.id, req.ip]
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email: user.email, role: user.role });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to StayEase 🎉',
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        phone: user.phone, role: user.role,
        status: user.status, kyc_status: user.kyc_status,
      },
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ─── SEND EMAIL OTP (for tenant email login) ─────────────────
const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    // Check user exists
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpStore[email.toLowerCase()] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    await sendMail({
      to: email,
      subject: 'Your StayEase login OTP',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;background:#04020f;padding:40px 20px;color:#fff;">
          <div style="max-width:480px;margin:0 auto;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:36px;text-align:center;">
            <div style="font-family:monospace;font-size:20px;font-weight:900;background:linear-gradient(135deg,#a78bfa,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:3px;margin-bottom:20px;">STAYEASE</div>
            <h2 style="color:#fff;margin:0 0 8px;">Your Login OTP</h2>
            <p style="color:rgba(255,255,255,0.45);font-size:13px;margin:0 0 28px;">Enter this code to sign in to your account</p>
            <div style="font-family:monospace;font-size:42px;font-weight:900;letter-spacing:12px;color:#a78bfa;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.25);border-radius:12px;padding:20px 10px;margin-bottom:24px;">${otp}</div>
            <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Send email OTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// ─── VERIFY EMAIL OTP ────────────────────────────────────────
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP required' });

    const stored = emailOtpStore[email.toLowerCase()];
    if (!stored) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) {
      delete emailOtpStore[email.toLowerCase()];
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    delete emailOtpStore[email.toLowerCase()]; // consumed

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    const token = generateToken(user.id, user.role);

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, 'email_otp_login', 'user', $2)`,
      [user.id, req.ip]
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        phone: user.phone, role: user.role,
        status: user.status, kyc_status: user.kyc_status,
      },
    });
  } catch (err) {
    console.error('Verify email OTP error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── FIREBASE OTP VERIFY & LOGIN/REGISTER ────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { idToken, name, role } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'Firebase ID token required' });

    const firebaseResult = await verifyFirebaseToken(idToken);
    if (!firebaseResult.success) return res.status(401).json({ success: false, message: 'Invalid OTP or token expired' });

    const { uid, phone_number } = firebaseResult.data;
    const phone = phone_number?.replace('+91', '').replace('+', '');
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number not found in token' });

    let userResult = await pool.query(
      'SELECT * FROM users WHERE phone = $1 OR firebase_uid = $2', [phone, uid]
    );
    let user = userResult.rows[0];
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const ins = await pool.query(
        `INSERT INTO users (name, phone, role, firebase_uid, status, kyc_status)
         VALUES ($1, $2, $3, $4, 'active', 'pending')
         RETURNING id, name, phone, email, role, status, kyc_status`,
        [name || 'User', phone, role || 'tenant', uid]
      );
      user = ins.rows[0];
    } else {
      if (!user.firebase_uid) {
        await pool.query('UPDATE users SET firebase_uid = $1 WHERE id = $2', [uid, user.id]);
      }
    }

    const token = generateToken(user.id, user.role);

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, $2, 'user', $3)`,
      [user.id, isNewUser ? 'user_registered' : 'user_login', req.ip]
    );

    res.json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      token,
      user: { id:user.id, name:user.name, email:user.email, phone:user.phone, role:user.role, status:user.status, kyc_status:user.kyc_status, photo_url:user.photo_url },
      isNewUser,
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
};

// ─── EMAIL + PASSWORD LOGIN ───────────────────────────────────
const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.status === 'suspended') return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, 'email_login', 'user', $2)`,
      [user.id, req.ip]
    );

    res.json({
      success: true, message: 'Login successful', token,
      user: { id:user.id, name:user.name, email:user.email, phone:user.phone, role:user.role, status:user.status, kyc_status:user.kyc_status },
    });
  } catch (err) {
    console.error('Email login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET CURRENT USER ─────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.kyc_status, u.photo_url, u.created_at,
              tp.property_id, tp.room_id, tp.check_in_date, tp.check_out_date, tp.monthly_rent
       FROM users u
       LEFT JOIN tenant_profiles tp ON tp.user_id = u.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email, phone, role',
      [name, email, req.user.id]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

module.exports = { register, verifyOTP, emailLogin, sendEmailOTP, verifyEmailOTP, getMe, updateProfile };