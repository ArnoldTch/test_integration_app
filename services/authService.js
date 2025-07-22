function createAuthService(UserModel) {
  async function authenticate(email, password) {
    const user = await UserModel.findOne({ email });

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

    return `token-${user._id}`;
  }

  return { authenticate };
}

module.exports = { createAuthService };