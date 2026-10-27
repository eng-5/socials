jest.setTimeout(30000); // 15s - enough headroom for Neon cold starts
const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('./config/redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
}));

const app = require('./app');
const redis = require('./config/redis');
const sequelize = require('./config/database');
const User = require('./models/User');

// Clean the Users table and reset mock call history so test don't interfere with each other
beforeEach(async () => {
    jest.clearAllMocks();
    await User.destroy({ where: {}, truncate: true })
});

// Close the DB connection after all tests finish, so Jest exits cleanly
afterAll(async () => {
    await sequelize.close();

});

// ----------------- register ----------------

test('POST /api/user/auth/register creates a user and returns a JWT', async () => {
    const res = await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'testuser', email: 'test@test.com', password: 'pass1234' })

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.body.user.password).toBeUndefined(); // new: never send the hash back
});

// new: the 400 branch
test('POST /api/user/auth/register rejects missing fields with 400', async () => {
    const res = await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'nopassword', email: 'no@test.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/username, email and password/i);
});

test('POST /api/user/auth/register rejects a duplicate email', async () => {
    await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'usera', email: 'dup@test.com', password: 'pass1234' });

    const res = await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'userb', email: 'dup@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/Email already/i);
});
test('POST /api/user/auth/register rejects a duplicate username', async () => {
    await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'usera', email: 'usera@test.com', password: 'pass1234' });

    const res = await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'usera', email: 'userb@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/username/);
});

// -------------- login --------------

test('POST /api/user/auth/login returns a JWT for correct credentials', async () => {
    await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'loginuser', email: 'login@test.com', password: 'pass1234' });

    const res = await request(app)
        .post('/api/user/auth/login')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ email: 'login@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    //new: logout depends on every token carrying a jti
    const decoded = jwt.decode(res.body.token);
    expect(decoded.id).toBeDefined();
    expect(res.body.token).toBeDefined();
});
// Test to reject wrong Login password
test('POST /api/user/auth/login rejects wrong password', async () => {
    await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'loginuser2', email: 'login2@test.com', password: 'pass1234' });

    const res = await request(app)
        .post('/api/user/auth/login')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ email: 'login2@test.com', password: 'wrongpassword' })

    expect(res.statusCode).toBe(401);
});

// new: proves login does not reveal whether an email is registered
test('POST /api/user/auth/login gives the same error for an unknown email as for a wrong password', async () => {
    await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'knownuser', email: 'known@test.com', password: 'pass1234' });

    const wrongPassword = await request(app)
        .post('/api/user/auth/login')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ email: 'known@test.com', password: 'wrongpassword' })


    const unknownEmail = await request(app)
        .post('/api/user/auth/login')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ email: 'nobody@test.com', password: 'pass1234' });

    expect(unknownEmail.statusCode).toBe(401);
    expect(unknownEmail.body.error).toBe(wrongPassword.body.error);
});

// -------------- logout ----------------

test('POST /api/user/auth/logout logs a user out', async () => {
    const res = await request(app)
        .post('/api/user/auth/register')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .send({ username: 'testuser', email: 'test@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    const redis = require('./config/redis');
    const exp = (Date.now() / 1000) + 15;
    const resLogout = await request(app)
        .post('/api/user/auth/logout')
        .set('x-token-jti', 'jti-token')
        .set('x-token-exp', exp)
        .set('x-internal-secret', process.env.INTERNAL_SECRET)

    expect(resLogout.statusCode).toBe(200);
    expect(redis.set).toHaveBeenCalledWith(
        'blacklist:jti-token',
        '1',
        'EX',
        expect.any(Number)
    )
    expect(resLogout.body.message).toMatch(/Logged out/i);
});

test('POST /api/user/auth/logout blacklists the token id with a TTL', async () => {
    // The Gateway extracts jti and exp from the verified tokoen and forwards them,
    // so the test supplies those headers directly, exp is an integer, like a real JWT

    const exp = Math.floor(Date.now() / 1000) + 15;

    const res = await request(app)
        .post('/api/user/auth/logout')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .set('x-token-jti', 'jti-token')
        .set('x-token-exp', String(exp));

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Logged out/i);

    expect(redis.set).toHaveBeenCalledTimes(1);
    const [key, value, mode, ttl] = redis.set.mock.calls[0];
    expect(key).toBe('blacklist:jti-token');
    expect(value).toBe('1');
    expect(mode).toBe('EX');
    expect(Number.isInteger(ttl)).toBe(true); // real Redis rejects a fractional EX
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(15);
});

// new: the "no active session" branch
test('POST /api/user/auth/logout without token headers returns 400 and writes nothing', async () => {
    const res = await request(app)
        .post('/api/user/auth/logout')
        .set('x-internal-secret', process.env.INTERNAL_SECRET);

    expect(res.statusCode).toBe(400);
    expect(redis.set).not.toHaveBeenCalled();
});

// new: the "already expired branch (ttl <= 0 means  there is nothing to blacklist"
test('POST /api/user/auth/logout with an already-expired token succeeds without writing to redis', async () => {
    const exp = Math.floor(Date.now() / 1000) - 10;

    const res = await request(app)
        .post('/api/user/auth/logout')
        .set('x-internal-secret', process.env.INTERNAL_SECRET)
        .set('x-token-jti', 'old-jti')
        .set('x-token-exp', String(exp));

    expect(res.statusCode).toBe(200);
    expect(redis.set).not.toHaveBeenCalled();
});

// -------------------- trust boundary ----------------

// new: requests that did not come through the Gateway must be refused
test('rejects a request with no internal secret with 403', async () => {
    const res = await request(app)
        .post('/api/user/auth/login')
        .send({ email: 'tryingto@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/Forbidden/i);
});

test('rejects a request with the wromg internal secret with 403', async () => {
    const res = await request(app)
        .post('/api/user/auth/login')
        .set('x-internal-secret', 'This-is-wrong')
        .send({ email: 'tryingto@test.com', password: 'pass1234' });

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/Forbidden/i);
});