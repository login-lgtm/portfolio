const { isAuthenticated } = require('./_lib/auth');
const CASES = require('./_data/cases');

module.exports = (req, res) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  res.status(200).json(CASES);
};
