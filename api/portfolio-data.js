// Public (no password) content feed for the portfolio viewer at /portfolio.
// Reads the SAME source as the website's case studies (api/_data/cases.js),
// so editing a case there updates the viewer and both PDFs automatically.
// The viewer link is only handed out selectively; it is unlisted (noindex).
const CASES = require('./_data/cases');

// Which case studies appear in the PDFs, in this order. Remove an id to hide it.
const INCLUDE = ['jco', 'mi4l', 'studio-liebe', 'nrg', 'ebru', 'dashboard', 'portfolio'];

module.exports = (req, res) => {
  const cases = INCLUDE.map(id => CASES.find(c => c.id === id)).filter(Boolean);
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=600');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.status(200).json({ cases });
};
