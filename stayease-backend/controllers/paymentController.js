const { pool } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ─── GET TENANT PAYMENTS ─────────────────────────────────────
const getMyPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pay.*, p.name as property_name, r.room_number
       FROM payments pay
       LEFT JOIN properties p ON p.id = pay.property_id
       LEFT JOIN rooms r ON r.id = pay.room_id
       WHERE pay.tenant_id = $1
       ORDER BY pay.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

// ─── PAY RENT ────────────────────────────────────────────────
const payRent = async (req, res) => {
  try {
    const { payment_id, payment_method, transaction_id } = req.body;

    // In production: verify payment with Razorpay here
    // const razorpayVerified = await verifyRazorpayPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);

    const invoiceNumber = `INV-${Date.now()}`;

    const result = await pool.query(
      `UPDATE payments
       SET status = 'paid', payment_method = $1, transaction_id = $2,
           invoice_number = $3, paid_date = NOW()
       WHERE id = $4 AND tenant_id = $5
       RETURNING *`,
      [payment_method, transaction_id || `TXN${Date.now()}`, invoiceNumber, payment_id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Create notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Rent Paid Successfully', $2, 'success')`,
      [req.user.id, `Payment of ₹${result.rows[0].amount} received. Invoice: ${invoiceNumber}`]
    );

    res.json({ success: true, data: result.rows[0], message: 'Payment successful!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
};

// ─── GET OWNER PAYMENTS ──────────────────────────────────────
const getOwnerPayments = async (req, res) => {
  try {
    // Get all properties of this owner
    const propsResult = await pool.query('SELECT id FROM properties WHERE owner_id = $1', [req.user.id]);
    const propIds = propsResult.rows.map(p => p.id);

    if (!propIds.length) return res.json({ success: true, data: [] });

    const result = await pool.query(
      `SELECT pay.*, u.name as tenant_name, u.phone as tenant_phone,
              p.name as property_name, r.room_number
       FROM payments pay
       LEFT JOIN users u ON u.id = pay.tenant_id
       LEFT JOIN properties p ON p.id = pay.property_id
       LEFT JOIN rooms r ON r.id = pay.room_id
       WHERE pay.property_id = ANY($1)
       ORDER BY pay.created_at DESC`,
      [propIds]
    );

    // Summary stats
    const paid    = result.rows.filter(p => p.status === 'paid').reduce((a, b) => a + b.amount, 0);
    const pending = result.rows.filter(p => p.status === 'pending').reduce((a, b) => a + b.amount, 0);
    const overdue = result.rows.filter(p => p.status === 'overdue').reduce((a, b) => a + b.amount, 0);

    res.json({ success: true, data: result.rows, summary: { paid, pending, overdue } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

// ─── AUTO GENERATE MONTHLY RENTS ─────────────────────────────
// Called by a cron job or manually by admin on 1st of each month
const generateMonthlyRents = async (req, res) => {
  try {
    const monthYear = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    const dueDate = new Date();
    dueDate.setDate(10); // Due by 10th of every month

    // Get all active tenant profiles
    const tenants = await pool.query(
      `SELECT tp.*, u.name as tenant_name
       FROM tenant_profiles tp
       JOIN users u ON u.id = tp.user_id
       WHERE tp.check_out_date > NOW() AND tp.monthly_rent IS NOT NULL`
    );

    let created = 0;
    for (const tenant of tenants.rows) {
      // Check if payment already exists for this month
      const existing = await pool.query(
        'SELECT id FROM payments WHERE tenant_id = $1 AND month_year = $2',
        [tenant.user_id, monthYear]
      );
      if (!existing.rows.length) {
        await pool.query(
          `INSERT INTO payments (tenant_id, property_id, room_id, amount, payment_type, status, month_year, due_date)
           VALUES ($1, $2, $3, $4, 'rent', 'pending', $5, $6)`,
          [tenant.user_id, tenant.property_id, tenant.room_id, tenant.monthly_rent, monthYear, dueDate]
        );
        created++;
      }
    }

    res.json({ success: true, message: `${created} rent invoices generated for ${monthYear}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate rents' });
  }
};

// ─── SEND PAYMENT REMINDER ───────────────────────────────────
const sendReminder = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const result = await pool.query(
      `SELECT pay.*, u.name, u.phone FROM payments pay JOIN users u ON u.id = pay.tenant_id WHERE pay.id = $1`,
      [payment_id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Payment not found' });

    const pay = result.rows[0];

    // Create in-app notification
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, 'warning')`,
      [pay.tenant_id, 'Rent Reminder', `Your rent of ₹${pay.amount} for ${pay.month_year} is pending. Please pay before the due date to avoid late fees.`]
    );

    // In production: also send SMS via Twilio / MSG91 here

    res.json({ success: true, message: `Reminder sent to ${pay.name}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send reminder' });
  }
};

module.exports = { getMyPayments, payRent, getOwnerPayments, generateMonthlyRents, sendReminder };
