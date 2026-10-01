// config/redis.test.js
jest.mock('ioredis', () =>
    jest.fn().mockImplementation(() => ({ on: jest.fn() }))
);

const ORIGINAL_URL = process.env.REDIS_URL;

beforeEach(() => {
    jest.resetModules(); // config/redis.js runs at require time, so reload it per test
});

afterEach(() => {
    process.env.REDIS_URL = ORIGINAL_URL;
});

test('passes REDIS_URL to the ioredis constructor', () => {
    process.env.REDIS_URL = 'redis://example.invalid:6390';
    const Redis = require('ioredis');
    require('./redis');

    expect(Redis).toHaveBeenCalledTimes(1);

    // With the REDIS_UR typo this is called with undefined, and the test fails
    expect(Redis).toHaveBeenCalledWith('redis://example.invalid:6390')
})
test('throws at startup when REDIS_URL is missing', () => {
    delete process.env.REDIS_URL;
    expect(() => require('./redis')).toThrow(/REDIS_URL/);

})