require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const { testConnection } = require('./config/db');
const routes             = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://stayease.netlify.app',
    'https://stayease.vercel.app',
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
}));

// ── Rate limiting ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests — please try again in 15 minutes' },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts — please try again later' },
});
app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// ── Request parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Routes ────────────────────────────────────────────────────
app.use('/api', routes);

// ── Root ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏠 StayEase API — PG & Co-Living Management Platform',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health:     'GET /api/health',
      auth:       'POST /api/auth/verify-otp  |  POST /api/auth/email-login',
      properties: 'GET /api/properties',
      docs:       'See README.md for full API documentation',
    }
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start ─────────────────────────────────────────────────────
const start = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🚀 StayEase API running on port ${PORT}`);
    console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`📡 API Base: http://localhost:${PORT}/api\n`);
  });
};

start();
