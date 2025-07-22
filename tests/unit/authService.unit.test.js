const { createAuthService } = require('../../services/authService');

describe('authService.authenticate', () => {
  const fakeUser = { _id: '123', email: '123@123.com', password: 'pass' };

  const mockUserModel = {
    findOne: jest.fn()
  };

  const authService = createAuthService(mockUserModel);

  it('retourne un token si email/mot de passe valides', async () => {
    mockUserModel.findOne.mockResolvedValue(fakeUser);

    const token = await authService.authenticate('48@48.com', 'pass');
    expect(token).toBe('token-abc123');
  });

  it('retourne 404 si user introuvable', async () => {
    mockUserModel.findOne.mockResolvedValue(null);

    await expect(authService.authenticate('2@2.com', 'pass'))
      .rejects.toThrow('Email inconnu');
  });

  it('retourne 401 si mauvais mot de passe', async () => {
    mockUserModel.findOne.mockResolvedValue({ ...fakeUser, password: 'good' });

    await expect(authService.authenticate('1@1.com', 'bad'))
      .rejects.toThrow('Mot de passe incorrect');
  });
});
