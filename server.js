import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment (no secrets in repo)
dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Basic JSON parsing
app.use(express.json({ limit: '200kb' }));

// Simple request logger (doesn't log bodies or env vars)
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.ip} ${req.method} ${req.originalUrl}`);
  next();
});

// Basic CORS allowing only configured frontend origin and localhost for dev
app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = [FRONTEND_ORIGIN, 'http://localhost:3000'];
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Simple in-memory rate limiter per IP
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 200; // max requests per window
const ipBuckets = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
  const now = Date.now();
  const bucket = ipBuckets.get(ip) || { count: 0, start: now };

  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }

  bucket.count += 1;
  ipBuckets.set(ip, bucket);

  if (bucket.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ ok: false, error: 'rate_limit_exceeded' });
  }
  next();
}

app.use(rateLimiter);

// Simple security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

// In-memory stores (read-only for documents served from public folder)
const publicActivity = [];
const supportSubmissions = [];
const donationRecords = [];

// Health
app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, status: 'ok', env: NODE_ENV, timestamp: new Date().toISOString() });
});

// Engine status (placeholder)
app.get('/api/v1/engine/status', (req, res) => {
  res.json({
    ok: true,
    status: {
      isActive: false,
      currentMode: 'ORBIT_VIEW',
      nodeCount: 0,
      activeStreams: [],
      recentActivity: [],
      timestamp: new Date().toISOString(),
      reconstructionActive: false,
      targetGeometry: null
    }
  });
});

// Architect proposal (called by frontend LaunchEngineModal)
app.post('/api/v1/agents/architect/proposal', (req, res) => {
  const { objective } = req.body || {};

  if (!objective || typeof objective !== 'string' || objective.trim().length === 0) {
    return res.status(400).json({ ok: false, error: { message: 'missing objective' } });
  }

  // NOTE: This is a simulated architect proposal placeholder. It does not perform any GIE mathematics.
  const id = 'proposal-' + Date.now();
  const proposal = {
    id,
    type: 'architecture_proposal',
    objective: objective.slice(0, 2000),
    status: 'DRAFT',
    architect: { id: 'gie-system-architect', provider: 'local-sim', model: 'gie-architect-v1' },
    architecture: `Simulated architecture proposal for objective: ${objective.slice(0, 500)}\n\nThis response is a placeholder. Owner approval required for any deployment.`,
    authority: { ownerApprovalRequired: true, automaticallyApproved: false, automaticallyDeployable: false }
  };

  // record a small public activity item
  publicActivity.unshift({ id: 'act-' + Date.now(), text: `Architect proposal generated: ${objective.slice(0, 80)}`, timestamp: new Date().toISOString(), type: 'INFO' });
  if (publicActivity.length > 200) publicActivity.pop();

  res.json({ ok: true, proposal });
});

// Geometric decode endpoint (placeholder)
app.post('/api/v1/geometric/decode', (req, res) => {
  const payload = req.body || {};
  if (!payload.matrix) {
    return res.status(400).json({ ok: false, error: { message: 'matrix required' } });
  }

  // Basic validation: matrix must be an array of arrays
  if (!Array.isArray(payload.matrix) || !Array.isArray(payload.matrix[0])) {
    return res.status(400).json({ ok: false, error: { message: 'matrix must be a 2D array' } });
  }

  // Return a read-only placeholder response. Do not claim to compute GIE mathematics.
  res.json({ ok: true, result: { analysis: 'placeholder', matches: [], note: 'Geometric decode not implemented on backend; this is a placeholder response.' } });
});

// Public activity
app.get('/api/v1/activity', (req, res) => {
  res.json({ ok: true, activity: publicActivity.slice(0, 50) });
});

// Documents: serve read-only files from public/evidence safely
const PUBLIC_ROOT = path.join(process.cwd(), 'public');
app.get('/api/v1/documents/*', (req, res) => {
  const relPath = req.params[0] || '';
  // Prevent path traversal
  if (relPath.includes('..')) {
    return res.status(400).json({ ok: false, error: { message: 'invalid path' } });
  }

  const filePath = path.join(PUBLIC_ROOT, relPath);
  if (!filePath.startsWith(PUBLIC_ROOT)) {
    return res.status(403).json({ ok: false, error: { message: 'forbidden' } });
  }

  if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
    return res.status(404).json({ ok: false, error: { message: 'not_found' } });
  }

  // Serve file as attachment or inline depending on query
  res.sendFile(filePath);
});

// Simple project metadata endpoint (read-only)
app.get('/api/v1/projects', (req, res) => {
  // Lightweight static sample; frontend may replace with real data later
  const samples = [
    { id: 'p-001', title: 'Parthenon Root-5 Dynamic Symmetry', status: 'ACTIVE', nodes: 1420, accuracy: '99.98%' },
    { id: 'p-002', title: 'Great Pyramid Planetary Grid Alignment', status: 'ACTIVE', nodes: 4890, accuracy: '99.99%' }
  ];
  res.json({ ok: true, projects: samples });
});

// Support contact submissions (in-memory only)
app.post('/api/v1/support/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: { message: 'message required' } });
  }

  const id = 'support-' + Date.now();
  const entry = { id, name: name || null, email: email || null, message: message.slice(0, 2000), timestamp: new Date().toISOString() };
  supportSubmissions.unshift(entry);
  if (supportSubmissions.length > 1000) supportSubmissions.pop();

  // Record public activity but do not leak email or message contents publicly
  publicActivity.unshift({ id: 'act-' + Date.now(), text: `New support submission received`, timestamp: new Date().toISOString(), type: 'NOTICE' });
  if (publicActivity.length > 200) publicActivity.pop();

  res.json({ ok: true, id });
});

// Donations placeholder: create payment intent stub (no real provider)
app.post('/api/v1/donations/create-intent', (req, res) => {
  const { amount, donorEmail } = req.body || {};
  if (!amount) return res.status(400).json({ ok: false, error: { message: 'amount required' } });

  const paymentIntentId = 'pi_stub_' + Date.now();
  const clientSecret = 'cs_stub_' + Date.now() + '_' + paymentIntentId;

  donationRecords.unshift({ id: paymentIntentId, amount, donorEmail: donorEmail || null, timestamp: new Date().toISOString(), status: 'pending' });
  if (donationRecords.length > 500) donationRecords.pop();

  res.json({ ok: true, clientSecret, paymentIntentId, note: 'This is a placeholder. No charges were made.' });
});

// Generic 404
app.use((req, res) => {
  res.status(404).json({ ok: false, error: { message: 'not_found' } });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR', err && err.stack ? err.stack : err);
  res.status(500).json({ ok: false, error: { message: 'internal_server_error' } });
});

// Start server
app.listen(PORT, () => {
  console.log(`GIE backend placeholder listening on port ${PORT} (frontend origin allowed: ${FRONTEND_ORIGIN})`);
});