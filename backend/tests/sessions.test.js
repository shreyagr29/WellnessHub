const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Session = require('../models/session');
const jwt = require('jsonwebtoken');

describe('Session Endpoints', () => {
  let user;
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Session.deleteMany({});

    // Create test user
    user = new User({
      email: 'test@example.com',
      password_hash: 'password123'
    });
    await user.save();

    // Generate token
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/my-sessions/save-draft', () => {
    test('Should save a new draft', async () => {
      const sessionData = {
        title: 'Test Session',
        tags: ['yoga', 'beginner'],
        json_file_url: 'https://example.com/session.json'
      };

      const response = await request(app)
        .post('/api/my-sessions/save-draft')
        .set('Authorization', `Bearer ${token}`)
        .send(sessionData)
        .expect(200);

      expect(response.body.session.title).toBe(sessionData.title);
      expect(response.body.session.status).toBe('draft');
    });

    test('Should not save draft without authentication', async () => {
      const sessionData = {
        title: 'Test Session',
        tags: ['yoga'],
        json_file_url: 'https://example.com/session.json'
      };

      await request(app)
        .post('/api/my-sessions/save-draft')
        .send(sessionData)
        .expect(401);
    });
  });

  describe('POST /api/my-sessions/publish', () => {
    test('Should publish a session', async () => {
      const sessionData = {
        title: 'Test Published Session',
        tags: ['meditation'],
        json_file_url: 'https://example.com/meditation.json'
      };

      const response = await request(app)
        .post('/api/my-sessions/publish')
        .set('Authorization', `Bearer ${token}`)
        .send(sessionData)
        .expect(200);

      expect(response.body.session.status).toBe('published');
    });
  });

  describe('GET /api/my-sessions', () => {
    test('Should get user sessions', async () => {
      // Create test session
      const session = new Session({
        user_id: user._id,
        title: 'Test Session',
        tags: ['test'],
        json_file_url: 'https://example.com/test.json',
        status: 'draft'
      });
      await session.save();

      const response = await request(app)
        .get('/api/my-sessions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.sessions).toHaveLength(1);
      expect(response.body.sessions[0].title).toBe('Test Session');
    });
  });
});
