// middleware/auth.test.js
const jwt = require('jsonwebtoken');
const verifyToken = require('./auth');

// so the test is independent and doesn't depend on environment setup
process.env.JWT_SECRET = 'same_secret_or_a_test_specific_one';

// Helper to build fake Express req/re/next objects - no real server needed
function mockReqResNext(headers = {}) {
    const req = { headers };
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

test('calls next() and sets x-user-id when the token is valid', () => {
    const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${token}` });

    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.headers['x-user-id']).toBe('user-123');
    expect(res.statusCode).toBeNull(); // no error response was sent
});

test('rejects with 401 when no authorization header is present', () => {
    const token = jwt.sign({ id: 'user-123' }, process.env.JWT_SECRET, { expiresIn: '1h' })
    const { req, res, next } = mockReqResNext();
    verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/missing or malformed/i);
});

test('rejects with 401 when the token is malformed garbage', () => {
    const { req, res, next } = mockReqResNext({ authorization: 'Bearer garbage' });
    verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid or expired/i);
});

test('rejects with 401 when the token was signed with a different secret', () => {
    const forgedToken = jwt.sign({ id: 'attacker' }, 'wrong-secret', { expiresIn: '1h' })
    const { req, res, next } = mockReqResNext({ authorization: `Bearer ${forgedToken}` })

    verifyToken(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(401);
})

test('strips a client-supplied x-user-id header even before checking the token', () => {
    const { req, res, next } = mockReqResNext({ 'x-user-id': 'spoofed-id' });

    verifyToken(req, res, next);

    expect(req.headers['x-user-id']).toBeUndefined();
});
