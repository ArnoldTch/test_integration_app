const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const testUser = {
  email: 'test@example.com',
  password: 'testpass123'
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteOne({ email: testUser.email });

  await new User(testUser).save();
});

afterAll(async () => {
  await User.deleteOne({ email: testUser.email });

  await mongoose.connection.close();
});

describe('POST /login', () => {
  it('devrait renvoyer un token avec email/mot de passe valides', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('devrait renvoyer 401 pour un mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: testUser.email, password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Mot de passe incorrect');
  });

  it('devrait renvoyer 404 pour un email inconnu', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'inconnu@example.com', password: 'irrelevant' });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Email inconnu');
  });
});