const User = require('../models/User');
const { createAuthService } = require('../services/authService');

const authService = createAuthService(User);

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const token = await authService.authenticate(email, password);
    res.json({ token });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

module.exports = { login };
