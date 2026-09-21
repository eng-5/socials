jest.setTimeout(15000); // 15s - enough headroom for Neon cold starts
const request = require('supertest');
const app = require('./app');
const sequelize = require('./config/database');
const User = require('./models/User');

// Clean the Users table each test don't interfere with each other
beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true })
});

// Close the DB connection after all tests finish, so Jest exits cleanly
afterAll(async () => {
    await sequelize.close();
});

test('POST /api/user/auth/register creates a user and returns a JWT', async () => {
    const res = await request(app).post('/api/user/auth/register').send({ username: 'testuser', email: 'test@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
});

test('POST /api/user/auth/register rejects a duplicate email', async () => {
    await request(app).post('/api/user/auth/register').send({ username: 'usera', email: 'dup@test.com', password: 'pass1234' });

    const res = await request(app).post('/api/user/auth/register').send({ username: 'userb', email: 'dup@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(400);
});
// test for the login route
test('POST /api/user/auth/login returns a JWT for correct credentials', async () => {
    await request(app).post('/api/user/auth/register').send({ username: 'loginuser', email: 'login@test.com', password: 'pass1234' });

    const res = await request(app).post('/api/user/auth/login').send({ email: 'login@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
});
// Test to reject wrong Login password
test('POST /api/user/auth/login rejects wrong password', async () => {
    await request(app).post('/api/user/auth/register').send({ username: 'loginuser2', email: 'login2@test.com', password: 'pass1234' });

    const res = await request(app).post('/api/user/auth/login').send({ email: 'login2@test.com', password: 'wrongpassword' })
    expect(res.statusCode).toBe(401);
});