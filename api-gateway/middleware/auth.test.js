// middleware/auth.test.js
const jwt = require('jsonwebtoken');
jest.mock('../config/redis', () => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
}));


// so the test is independent and doesn't depend on environment setup
process.env.JWT_SECRET = 'same_secret_or_a_test_specific_one';
process.env.INTERNAL_SECRET = 'a_test_internal_secret';

const verifyToken = require('./auth');
const redis = require('../config/redis');

beforeEach(() => {
    jest.clearAllMocks();
})

// Helper to build fake Express req/re/next objects - no real server needed
function mockReqResNext(headers = {}) {
    const req = {
        headers,
        log: {
            error: jest.fn(), // Mock logger so req.log.error() doesn't crash the test
            info: jest.fn()
        }
    };
    const res = {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
    const next = jest.fn();
    return { req, res, next };
}

function signValidToken(jti = 'jti-123') {
    return jwt.sign({ id: 'user-123', jti }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

test('calls next() and sets x-user-id when the token is valid', async () => {
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${signValidToken('jti-123')}` });

    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.headers['x-user-id']).toBe('user-123');
    expect(req.headers['x-token-jti']).toBe('jti-123');
    expect(req.headers['x-token-exp']).toBeDefined();
    expect(req.headers['x-internal-secret']).toBe(process.env.INTERNAL_SECRET);
    expect(redis.get).toHaveBeenCalledWith('blacklist:jti-123');
    expect(res.statusCode).toBeNull(); // no error response was sent
});

test('rejects with 401 when no authorization header is present', async () => {
    const { req, res, next } = mockReqResNext();

    await verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/missing or malformed/i);
});

test('rejects with 401 when the token is malformed garbage', async () => {
    const { req, res, next } = mockReqResNext({ authorization: 'Bearer garbage' });
    await verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid or expired/i);
});

test('rejects with 401 when the token was signed with a different secret', async () => {
    const forgedToken = jwt.sign({ id: 'attacker', jti: 'x' }, 'wrong-secret', { expiresIn: '1h' })
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${forgedToken}` })

    await verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
})

test('rejects with 401 when the token has been revoked (blacklisted)', async () => {
    redis.get.mockResolvedValueOnce('1'); // Redis says this jti is on the blacklist
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${signValidToken('revoked-jti')}` });

    await verifyToken(req, res, next);

    expect(redis.get).toHaveBeenCalledWith('blacklist:revoked-jti');
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid or expired session/i);
});

test('fails closed with 401 when Redis is unreachable', async () => {
    redis.get.mockRejectedValueOnce(new Error('Redis is down'));
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${signValidToken('jti-123')}` });

    await verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
});

test('strips client-supplied identity headers before checking the token', async () => {
    const { req, res, next } = mockReqResNext({
        'x-user-id': 'spoofed-id',
        'x-internal-secret': 'spoofed-secret',
        'x-token-jti': 'spoofed-jti',
        'x-token-exp': '3748398429329223293'
    });

    await verifyToken(req, res, next);

    expect(req.headers['x-user-id']).toBeUndefined();
    expect(req.headers['x-internal-secret']).toBeUndefined();
    expect(req.headers['x-token-jti']).toBeUndefined();
    expect(req.headers['x-token-exp']).toBeUndefined();
    expect(res.statusCode).toBe(401);
});
