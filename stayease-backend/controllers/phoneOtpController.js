const { pool } = require('../config/db');
const { generateToken } = require('../middleware/auth');

// In-memory OTP store  { phone → { otp, expiresAt } }
const phoneOtpStore = {};

// ─── HELPER: send SMS via Fast2SMS (Quick SMS / OTP route) ───
// Fast2SMS "OTP" route does NOT require DLT registration in India.
// Docs: https://www.fast2sms.com/dev/bulkV2
async function sendSMS(phone, otp) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  FAST2SMS_API_KEY not set — SMS not sent (dev mode)');
    console.log(`📱 [DEV] OTP for ${phone}: ${otp}`);
    return { success: true, dev: true };
  }

  try {
    const params = new URLSearchParams({
      authorization: apiKey,
      route: 'otp',
      variables_values: otp,
      flash: '0',
      numbers: phone,
    });

    const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
      method: 'GET',
      headers: { 'cache-control': 'no-cache' },
    });
    const data = await res.json();

    if (data.return === true) {
      return { success: true };
    }
    console.error('Fast2SMS error:', data);
    return { success: false, error: data.message || 'SMS sending failed' };
  } catch (err) {
    console.error('Fast2SMS request error:', err.message);
    return { success: false, error: err.message };
  }
}

// ─── SEND PHONE OTP (for tenant phone login) ─────────────────
const sendPhoneOTP = async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

    phone = phone.replace(/\D/g, '').slice(-10); // keep last 10 digits
    if (phone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit phone number' });
    }

    // Check user exists
    const result = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'No account found with this phone number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    phoneOtpStore[phone] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const smsResult = await sendSMS(phone, otp);
    if (!smsResult.success) {
      return res.status(500).json({ success: false, message: smsResult.error || 'Failed to send SMS' });
    }

    res.json({
      success: true,
      message: 'OTP sent to your phone',
      ...(smsResult.dev ? { devOtp: otp } : {}), // helpful during local dev only
    });
  } catch (err) {
    console.error('Send phone OTP error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// ─── VERIFY PHONE OTP ──────────────────────────────────────────
const verifyPhoneOTP = async (req, res) => {
  try {
    let { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ success: false, message: 'Phone and OTP required' });

    phone = phone.replace(/\D/g, '').slice(-10);

    const stored = phoneOtpStore[phone];
    if (!stored) return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    if (Date.now() > stored.expiresAt) {
      delete phoneOtpStore[phone];
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }
    if (stored.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }

    delete phoneOtpStore[phone]; // consumed

    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ success: false, message: 'Account not found' });

    const token = generateToken(user.id, user.role);

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, ip_address) VALUES ($1, 'phone_otp_login', 'user', $2)`,
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
    console.error('Verify phone OTP error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { sendPhoneOTP, verifyPhoneOTP };
