const User = require('../models/User');

async function authenticate(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error('Email inconnu');
    error.status = 404;
    throw error;
  }

  if (user.password !== password) { 
    const error = new Error('Mot de passe incorrect');
    error.status = 401;
    throw error;
  }

  const token = `token-${user._id}`;
  return token;
}

module.exports = { authenticate };
