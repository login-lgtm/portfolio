// Shared cookie signing/verification for the password gate. Node's built-in
// crypto only — no dependencies, so this runs on Vercel's default Node
// runtime with zero config.
const crypto = require('crypto');

const COOKIE_NAME = 'vivien_auth';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('SESSION_SECRET is not set');
  return s;
}

function sign(expiry) {
  return crypto.createHmac('sha256', secret()).update(String(expiry)).digest('hex');
}

function makeToken() {
  const expiry = Date.now() + MAX_AGE_SECONDS * 1000;
  return `${expiry}.${sign(expiry)}`;
}

function verifyToken(token) {
  if (!token) return false;
  const [expiryStr, mac] = token.split('.');
  if (!expiryStr || !mac) return false;
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  const expected = sign(expiry);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie);
  return verifyToken(cookies[COOKIE_NAME]);
}

function setAuthCookie(res) {
  const token = makeToken();
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}`
  );
}

function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

module.exports = { isAuthenticated, setAuthCookie, clearAuthCookie, COOKIE_NAME };
