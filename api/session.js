const { isAuthenticated } = require('./_lib/auth');

// Lets the page ask "am I still logged in?" on load, since the real
// session now lives in an HttpOnly cookie the client can't read directly.
module.exports = (req, res) => {
  res.status(200).json({ authenticated: isAuthenticated(req) });
};
