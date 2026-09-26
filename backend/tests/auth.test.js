import { test, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const mongoServer = await MongoMemoryServer.create();

process.env.MONGO_URI = mongoServer.getUri();

const { default: app } = await import('../server.js');
const { default: User } = await import('../models/User.js');

before(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

test('GET /api/health should return healthy status', async () => {
  const response = await request(app)
    .get('/api/health');

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(response.body.status, 'healthy');
});

test('POST /api/auth/register should create a new user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Student',
      email: 'test@student.com',
      password: 'Test@123'
    });

  assert.strictEqual(response.statusCode, 201);
  assert.ok(response.body.token);
  assert.strictEqual(response.body.user.email, 'test@student.com');
});

test('POST /api/auth/login should authenticate a user', async () => {
  await User.create({
    name: 'Login Student',
    email: 'login@student.com',
    password: 'Test@123'
  });

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'login@student.com',
      password: 'Test@123'
    });

  assert.strictEqual(response.statusCode, 200);
  assert.ok(response.body.token);
});

test('POST /api/auth/register should reject missing fields', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'missing@student.com'
    });

  assert.strictEqual(response.statusCode, 400);
});