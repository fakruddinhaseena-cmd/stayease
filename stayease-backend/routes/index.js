const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controllers
const auth       = require('../controllers/authController');
const phoneOtp   = require('../controllers/phoneOtpController');
const property   = require('../controllers/propertyController');
const payment    = require('../controllers/paymentController');
const { pool }   = require('../config/db');

// ══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════
router.post('/auth/register',         auth.register);          // NEW: Register with name/phone/email/password
router.post('/auth/send-email-otp',   auth.sendEmailOTP);      // NEW: Send OTP to email (tenant login)
router.post('/auth/verify-email-otp', auth.verifyEmailOTP);    // NEW: Verify email OTP → login
router.post('/auth/send-phone-otp',   phoneOtp.sendPhoneOTP);  // Phone OTP via Fast2SMS (tenant login)
router.post('/auth/verify-phone-otp', phoneOtp.verifyPhoneOTP);// Verify phone OTP → login
router.post('/auth/email-login',      auth.emailLogin);        // Email + password login (owner/admin)
router.get ('/auth/me',               protect, auth.getMe);
router.put ('/auth/profile',          protect, auth.updateProfile);

// ══════════════════════════════════════════════════════════════
// PROPERTY ROUTES
// ══════════════════════════════════════════════════════════════
router.get ('/properties',               property.getProperties);           // Public: list all
router.get ('/properties/:id',           property.getProperty);             // Public: single
router.post('/properties',               protect, authorize('owner','admin'), property.createProperty);
router.put ('/properties/:id',           protect, authorize('owner','admin'), property.updateProperty);
router.get ('/owner/properties',         protect, authorize('owner'),        property.getMyProperties);
router.put ('/admin/properties/:id/approve', protect, authorize('admin'),   property.approveProperty);

// ══════════════════════════════════════════════════════════════
// ROOM ROUTES
// ══════════════════════════════════════════════════════════════
router.get('/rooms/:propertyId', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE property_id = $1 ORDER BY floor, room_number',
      [req.params.propertyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch rooms' }); }
});

router.post('/rooms', protect, authorize('owner','admin'), async (req, res) => {
  try {
    const { property_id, room_number, floor, type, monthly_rent } = req.body;
    const result = await pool.query(
      `INSERT INTO rooms (property_id, room_number, floor, type, monthly_rent) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [property_id, room_number, floor, type, monthly_rent]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to create room' }); }
});

// ══════════════════════════════════════════════════════════════
// TENANT ROUTES
// ══════════════════════════════════════════════════════════════
router.get('/owner/tenants', protect, authorize('owner','admin'), async (req, res) => {
  try {
    const propsResult = await pool.query('SELECT id FROM properties WHERE owner_id = $1', [req.user.id]);
    const propIds = propsResult.rows.map(p => p.id);
    if (!propIds.length) return res.json({ success: true, data: [] });

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.kyc_status, u.status,
              tp.*, r.room_number, p.name as property_name
       FROM users u
       JOIN tenant_profiles tp ON tp.user_id = u.id
       LEFT JOIN rooms r ON r.id = tp.room_id
       LEFT JOIN properties p ON p.id = tp.property_id
       WHERE tp.property_id = ANY($1) ORDER BY tp.created_at DESC`,
      [propIds]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch tenants' }); }
});

// Check-in a new tenant
router.post('/owner/checkin', protect, authorize('owner','admin'), async (req, res) => {
  try {
    const { user_id, property_id, room_id, bed_id, check_in_date, check_out_date, monthly_rent, security_deposit, lock_in_months } = req.body;

    // Create tenant profile
    const result = await pool.query(
      `INSERT INTO tenant_profiles (user_id, property_id, room_id, bed_id, check_in_date, check_out_date, monthly_rent, security_deposit, lock_in_months)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id) DO UPDATE SET property_id=$2, room_id=$3, bed_id=$4, check_in_date=$5, check_out_date=$6, monthly_rent=$7, security_deposit=$8, lock_in_months=$9, updated_at=NOW()
       RETURNING *`,
      [user_id, property_id, room_id, bed_id, check_in_date, check_out_date, monthly_rent, security_deposit, lock_in_months || 11]
    );

    // Update room status
    await pool.query("UPDATE rooms SET status='occupied' WHERE id=$1", [room_id]);
    if (bed_id) await pool.query("UPDATE beds SET status='occupied', tenant_id=$1 WHERE id=$2", [user_id, bed_id]);

    // Create deposit payment record
    await pool.query(
      `INSERT INTO payments (tenant_id, property_id, room_id, amount, payment_type, status, paid_date)
       VALUES ($1,$2,$3,$4,'deposit','paid',NOW())`,
      [user_id, property_id, room_id, security_deposit]
    );

    // Notify tenant
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, 'Welcome to StayEase! 🎉', $2, 'success')`,
      [user_id, `You have been checked in successfully. Your room is ready!`]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Check-in successful' });
  } catch (err) {
    console.error('Checkin error:', err);
    res.status(500).json({ success: false, message: 'Check-in failed' });
  }
});

// ══════════════════════════════════════════════════════════════
// PAYMENT ROUTES
// ══════════════════════════════════════════════════════════════
router.get ('/payments/my',               protect,                        payment.getMyPayments);
router.post('/payments/:payment_id/pay',  protect, authorize('tenant'),   payment.payRent);
router.get ('/owner/payments',            protect, authorize('owner'),    payment.getOwnerPayments);
router.post('/admin/payments/generate',   protect, authorize('admin'),    payment.generateMonthlyRents);
router.post('/owner/payments/:payment_id/remind', protect, authorize('owner'), payment.sendReminder);

// ══════════════════════════════════════════════════════════════
// SERVICE REQUEST ROUTES
// ══════════════════════════════════════════════════════════════
router.get('/service-requests/my', protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sr.*, u.name as assigned_name, p.name as property_name
       FROM service_requests sr
       LEFT JOIN users u ON u.id = sr.assigned_to
       LEFT JOIN properties p ON p.id = sr.property_id
       WHERE sr.tenant_id = $1 ORDER BY sr.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch requests' }); }
});

router.post('/service-requests', protect, authorize('tenant'), async (req, res) => {
  try {
    const { property_id, room_id, category, title, description, priority } = req.body;
    const result = await pool.query(
      `INSERT INTO service_requests (tenant_id, property_id, room_id, category, title, description, priority)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, property_id, room_id, category, title, description, priority || 'medium']
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Request submitted' });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to submit request' }); }
});

router.put('/service-requests/:id', protect, authorize('owner','admin'), async (req, res) => {
  try {
    const { status, assigned_to } = req.body;
    const resolved = status === 'resolved' ? ', resolved_at=NOW()' : '';
    const result = await pool.query(
      `UPDATE service_requests SET status=$1, assigned_to=$2, updated_at=NOW()${resolved} WHERE id=$3 RETURNING *`,
      [status, assigned_to, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: 'Update failed' }); }
});

// ══════════════════════════════════════════════════════════════
// KYC ROUTES
// ══════════════════════════════════════════════════════════════
router.post('/kyc/submit', protect, async (req, res) => {
  try {
    const { doc_type, doc_number, doc_url } = req.body;
    const result = await pool.query(
      `INSERT INTO kyc_documents (user_id, doc_type, doc_number, doc_url, status)
       VALUES ($1,$2,$3,$4,'pending')
       ON CONFLICT (user_id) DO UPDATE SET doc_type=$2, doc_number=$3, doc_url=$4, status='pending', reviewed_at=NULL
       RETURNING *`,
      [req.user.id, doc_type, doc_number, doc_url]
    );
    res.json({ success: true, data: result.rows[0], message: 'KYC submitted for review' });
  } catch (err) { res.status(500).json({ success: false, message: 'KYC submission failed' }); }
});

router.get('/admin/kyc', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT k.*, u.name, u.phone, u.email FROM kyc_documents k JOIN users u ON u.id = k.user_id WHERE k.status='pending' ORDER BY k.created_at ASC`
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch KYC queue' }); }
});

router.put('/admin/kyc/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { action } = req.body;
    const status = action === 'approve' ? 'verified' : 'rejected';
    await pool.query(
      `UPDATE kyc_documents SET status=$1, reviewed_by=$2, reviewed_at=NOW() WHERE id=$3`,
      [status, req.user.id, req.params.id]
    );
    const doc = await pool.query('SELECT user_id FROM kyc_documents WHERE id=$1', [req.params.id]);
    if (status === 'verified') {
      await pool.query("UPDATE users SET kyc_status='verified' WHERE id=$1", [doc.rows[0].user_id]);
    }
    res.json({ success: true, message: `KYC ${status}` });
  } catch (err) { res.status(500).json({ success: false, message: 'KYC action failed' }); }
});

// ══════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════════
router.get('/notifications', protect, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed' }); }
});

router.put('/notifications/read-all', protect, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read=true WHERE user_id=$1', [req.user.id]);
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) { res.status(500).json({ success: false }); }
});

// ══════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════════════
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const [users, props, rooms, payments, complaints] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, role FROM users GROUP BY role'),
      pool.query('SELECT COUNT(*) as total, status FROM properties GROUP BY status'),
      pool.query("SELECT COUNT(*) FILTER(WHERE status='occupied') as occupied, COUNT(*) as total FROM rooms"),
      pool.query("SELECT SUM(amount) FILTER(WHERE status='paid') as revenue, SUM(amount) FILTER(WHERE status='pending') as pending FROM payments"),
      pool.query("SELECT COUNT(*) FILTER(WHERE status!='resolved') as open_complaints FROM service_requests"),
    ]);

    res.json({
      success: true,
      data: {
        users: users.rows,
        properties: props.rows,
        rooms: rooms.rows[0],
        payments: payments.rows[0],
        complaints: complaints.rows[0],
      }
    });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch stats' }); }
});

router.get('/admin/users', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id,name,email,phone,role,status,kyc_status,created_at FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed to fetch users' }); }
});

router.put('/admin/users/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE users SET status=$1 WHERE id=$2', [status, req.params.id]);
    res.json({ success: true, message: `User ${status}` });
  } catch (err) { res.status(500).json({ success: false, message: 'Failed' }); }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'StayEase API running', timestamp: new Date().toISOString() });
});

module.exports = router;
