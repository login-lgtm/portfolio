const { setAuthCookie } = require('./_lib/auth');

// Very small rate limit — enough to stop naive brute forcing without a
// database. Resets whenever the function's container recycles, which is
// fine here: this isn't the only line of defense, just friction.
const attempts = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_ATTEMPTS = 10;

function tooManyAttempts(ip) {
  const now = Date.now();
  const entry = attempts.get(ip) || { count: 0, reset: now + WINDOW_MS };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + WINDOW_MS; }
  entry.count++;
  attempts.set(ip, entry);
  return entry.count > MAX_ATTEMPTS;
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (tooManyAttempts(ip)) {
    res.status(429).json({ ok: false, error: 'too many attempts, slow down' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const password = body.password;

  if (!process.env.SITE_PASSWORD) {
    res.status(500).json({ ok: false, error: 'server not configured' });
    return;
  }

  if (typeof password === 'string' && password === process.env.SITE_PASSWORD) {
    setAuthCookie(res);
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'wrong password' });
  }
};
