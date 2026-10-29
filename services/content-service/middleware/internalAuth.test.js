// middleware/internalAuth.test.js
const verifyInternalSecret = require('./internalAuth');

const ORIGINAL_SECRET = process.env.INTERNAL_SECRET;

afterEach(() => {
    // Put the environment back so nothing leaks into other tests
    if (ORIGINAL_SECRET === undefined) delete process.env.INTERNAL_SECRET;
    else process.env.INTERNAL_SECRET = ORIGINAL_SECRET;
});

// runs the middleware against a fake request - no server needed
function run(headers = {}) {
    const req = { headers };
    const res = {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };

    const next = jest.fn();
    verifyInternalSecret(req, res, next);
    return { res, next };
}

test('allows a request carrying the correct secret', () => {
    process.env.INTERNAL_SECRET = 'test-secret';
    const { res, next } = run({ 'x-internal-secret': 'test-secret' });

    expect(next).toHaveBeenCalled();
    expect(res.statusCode).toBeNull();
});

test('rejects a request with no secret header', () => {
    process.env.INTERNAL_SECRET = 'test-secret';
    const { res, next } = run();

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
});

test('rejects a request with the wrong secret', () => {
    process.env.INTERNAL_SECRET = 'test-secret';
    const { res, next } = run({ 'x-internal-secret': 'wrong' });

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
});

// the important on: with the old check this test FAILS, because
// undefined !== undefined is false and the request slips through,
test('fails closed when INTERNAL_SECRET is not configured', () => {
    delete process.env.INTERNAL_SECRET;
    const { res, next } = run();

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
})