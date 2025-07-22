const request = require('supertest');
const app = require('../../app');
const { connectDB, seedUser, cleanupDB } = require('../helpers/db');
const { validUser } = require('../helpers/testUser');

beforeAll(async () => {
  await connectDB();
  await seedUser();
});

afterAll(async () => {
  await cleanupDB();
});

describe('POST /login (integration)', () => {
  it('retourne un token avec credentials valides', async () => {
    const res = await request(app).post('/login').send(validUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('retourne 401 si mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: validUser.email, password: 'wrong' });

    expect(res.statusCode).toBe(401);
  });

  it('retourne 404 si email inconnu', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'not@found.com', password: 'irrelevant' });

    expect(res.statusCode).toBe(404);
  });
});
