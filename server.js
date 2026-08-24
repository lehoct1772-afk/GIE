import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';
const GOOGLE_MARKETPLACE_ENABLED = process.env.GOOGLE_MARKETPLACE_ENABLED === 'true';

const app = express();
app.use(express.json({ limit: '200kb' }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl}`);
  next();
});

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

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 200;
const ipBuckets = new Map();

app.use((req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = ipBuckets.get(ip) || { count: 0, start: now };
  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }
  bucket.count += 1;
  ipBuckets.set(ip, bucket);
  if (bucket.count > RATE_LIMIT_MAX) return res.status(429).json({ ok: false, error: 'rate_limit_exceeded' });
  next();
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

const publicActivity = [];
const supportSubmissions = [];

app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true, status: 'ok', env: NODE_ENV, marketplace: GOOGLE_MARKETPLACE_ENABLED ? 'google-cloud-marketplace' : 'pending-configuration', timestamp: new Date().toISOString() });
});

app.get('/api/v1/engine/status', (req, res) => {
  res.json({ ok: true, status: { isActive: false, currentMode: 'ORBIT_VIEW', nodeCount: 0, activeStreams: [], recentActivity: [], timestamp: new Date().toISOString(), reconstructionActive: false, targetGeometry: null } });
});

app.post('/api/v1/agents/architect/proposal', (req, res) => {
  const { objective } = req.body || {};
  if (!objective || typeof objective !== 'string' || objective.trim().length === 0) return res.status(400).json({ ok: false, error: { message: 'missing objective' } });
  const proposal = { id: 'proposal-' + Date.now(), type: 'architecture_proposal', objective: objective.slice(0, 2000), status: 'DRAFT', architect: { id: 'gie-system-architect', provider: 'local-sim', model: 'gie-architect-v1' }, architecture: `Architecture proposal for objective: ${objective.slice(0, 500)}`, authority: { ownerApprovalRequired: true, automaticallyApproved: false, automaticallyDeployable: false } };
  publicActivity.unshift({ id: 'act-' + Date.now(), text: `Architect proposal generated: ${objective.slice(0, 80)}`, timestamp: new Date().toISOString(), type: 'INFO' });
  if (publicActivity.length > 200) publicActivity.pop();
  res.json({ ok: true, proposal });
});

app.post('/api/v1/geometric/decode', (req, res) => {
  const payload = req.body || {};
  if (!payload.matrix) return res.status(400).json({ ok: false, error: { message: 'matrix required' } });
  if (!Array.isArray(payload.matrix) || !Array.isArray(payload.matrix[0])) return res.status(400).json({ ok: false, error: { message: 'matrix must be a 2D array' } });
  res.json({ ok: true, result: { analysis: 'placeholder', matches: [] } });
});

app.get('/api/v1/activity', (req, res) => res.json({ ok: true, activity: publicActivity.slice(0, 50) }));

const PUBLIC_ROOT = path.join(process.cwd(), 'public');
app.get('/api/v1/documents/*', (req, res) => {
  const relPath = req.params[0] || '';
  if (relPath.includes('..')) return res.status(400).json({ ok: false, error: { message: 'invalid path' } });
  const filePath = path.join(PUBLIC_ROOT, relPath);
  if (!filePath.startsWith(PUBLIC_ROOT)) return res.status(403).json({ ok: false, error: { message: 'forbidden' } });
  if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) return res.status(404).json({ ok: false, error: { message: 'not_found' } });
  res.sendFile(filePath);
});

app.get('/api/v1/projects', (req, res) => res.json({ ok: true, projects: [] }));

app.post('/api/v1/support/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!message || typeof message !== 'string') return res.status(400).json({ ok: false, error: { message: 'message required' } });
  const id = 'support-' + Date.now();
  supportSubmissions.unshift({ id, name: name || null, email: email || null, message: message.slice(0, 2000), timestamp: new Date().toISOString() });
  if (supportSubmissions.length > 1000) supportSubmissions.pop();
  res.json({ ok: true, id });
});

// Google Cloud Marketplace integration boundary.
// Billing/account procurement is handled by Google Marketplace once the product and account are approved/configured.
// No direct card processor is embedded in GIE.
app.get('/api/v1/marketplace/status', (req, res) => {
  res.json({
    ok: true,
    provider: 'google-cloud-marketplace',
    enabled: GOOGLE_MARKETPLACE_ENABLED,
    ownerSetupRequired: !GOOGLE_MARKETPLACE_ENABLED,
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => res.status(404).json({ ok: false, error: { message: 'not_found' } }));
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR', err?.stack || err);
  res.status(500).json({ ok: false, error: { message: 'internal_server_error' } });
});

app.listen(PORT, () => console.log(`GIE backend listening on port ${PORT} (marketplace: Google Cloud Marketplace)`));
