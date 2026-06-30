const { pool } = require('../config/db');

// ─── GET ALL PROPERTIES (public, with filters) ───────────────
const getProperties = async (req, res) => {
  try {
    const { city, gender, min_price, max_price, type, search, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT p.*, u.name as owner_name,
             COALESCE(json_agg(pi.image_url) FILTER (WHERE pi.id IS NOT NULL), '[]') as images,
             COUNT(DISTINCT r.id) as total_rooms,
             COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'available') as available_rooms
      FROM properties p
      LEFT JOIN users u ON u.id = p.owner_id
      LEFT JOIN property_images pi ON pi.property_id = p.id
      LEFT JOIN rooms r ON r.property_id = p.id
      WHERE p.status = 'active' AND p.approval_status = 'approved'
    `;
    const params = [];
    let paramCount = 1;

    if (city)      { query += ` AND LOWER(p.city) = LOWER($${paramCount++})`; params.push(city); }
    if (gender && gender !== 'Any') { query += ` AND p.gender IN ($${paramCount++}, 'Any')`; params.push(gender); }
    if (min_price) { query += ` AND p.monthly_rent >= $${paramCount++}`; params.push(parseInt(min_price)); }
    if (max_price) { query += ` AND p.monthly_rent <= $${paramCount++}`; params.push(parseInt(max_price)); }
    if (type)      { query += ` AND p.type = $${paramCount++}`; params.push(type); }
    if (search)    { query += ` AND (LOWER(p.name) LIKE $${paramCount} OR LOWER(p.locality) LIKE $${paramCount} OR LOWER(p.city) LIKE $${paramCount})`; params.push(`%${search.toLowerCase()}%`); paramCount++; }

    query += ` GROUP BY p.id, u.name ORDER BY p.rating DESC, p.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('getProperties error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
};

// ─── GET SINGLE PROPERTY ─────────────────────────────────────
const getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, u.name as owner_name, u.phone as owner_phone,
              COALESCE(json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.id IS NOT NULL), '[]') as images,
              pf.*
       FROM properties p
       LEFT JOIN users u ON u.id = p.owner_id
       LEFT JOIN property_images pi ON pi.property_id = p.id
       LEFT JOIN property_features pf ON pf.property_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, u.name, u.phone, pf.id`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    // Get rooms separately
    const roomsResult = await pool.query(
      'SELECT * FROM rooms WHERE property_id = $1 ORDER BY floor, room_number',
      [id]
    );
    const property = result.rows[0];
    property.rooms = roomsResult.rows;
    res.json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch property' });
  }
};

// ─── CREATE PROPERTY (owner only) ────────────────────────────
const createProperty = async (req, res) => {
  try {
    const { name, description, type, gender, city, locality, address, pincode, monthly_rent, security_deposit, amenities, rules } = req.body;
    const result = await pool.query(
      `INSERT INTO properties (owner_id, name, description, type, gender, city, locality, address, pincode, monthly_rent, security_deposit, amenities, rules, status, approval_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'active','pending')
       RETURNING *`,
      [req.user.id, name, description, type, gender, city, locality, address, pincode, monthly_rent, security_deposit, amenities, rules]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Property submitted for approval' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create property' });
  }
};

// ─── UPDATE PROPERTY ─────────────────────────────────────────
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, monthly_rent, amenities, rules, status } = req.body;
    const result = await pool.query(
      `UPDATE properties SET name=$1, description=$2, monthly_rent=$3, amenities=$4, rules=$5, status=$6, updated_at=NOW()
       WHERE id=$7 AND owner_id=$8 RETURNING *`,
      [name, description, monthly_rent, amenities, rules, status, id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// ─── OWNER'S OWN PROPERTIES ──────────────────────────────────
const getMyProperties = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
              COALESCE(json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.id IS NOT NULL), '[]') as images,
              COUNT(DISTINCT r.id) as total_rooms,
              COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'available') as available_rooms,
              COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'occupied') as occupied_rooms
       FROM properties p
       LEFT JOIN property_images pi ON pi.property_id = p.id
       LEFT JOIN rooms r ON r.property_id = p.id
       WHERE p.owner_id = $1
       GROUP BY p.id ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
};

// ─── ADMIN: APPROVE / REJECT PROPERTY ───────────────────────
const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const status = action === 'approve' ? 'approved' : 'rejected';
    const result = await pool.query(
      'UPDATE properties SET approval_status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, id]
    );
    res.json({ success: true, data: result.rows[0], message: `Property ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Action failed' });
  }
};

module.exports = { getProperties, getProperty, createProperty, updateProperty, getMyProperties, approveProperty };
