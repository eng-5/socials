// test/post.test.js
require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');


beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
}, 30000);



afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('POST /api/content/posts', () => {
    it('creates a post when text is provided', async () => {
        const res = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'test-user-123')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'hello world' });
        expect(res.statusCode).toBe(201);
        expect(res.body.post.text).toBe('hello world');
        expect(res.body.post.authorId).toBe('test-user-123');
    })
});

describe('GET /api/content/posts?page=1&limit=2', () => {
    it('gets all posts and checks pagination', async () => {
        const num = [1, 2, 3, 4, 5];
        for (const n of num) {
            const res = await request(app).post('/api/content/posts')
                .set('x-user-id', 'test-user-123')
                .set('x-internal-secret', process.env.INTERNAL_SECRET)
                .send({ text: `hello world ${n}` });
            expect(res.statusCode).toBe(201);
            expect(res.body.post.text).toBe(`hello world ${n}`);
            expect(res.body.post.authorId).toBe('test-user-123');
        }
        const res = await request(app).get('/api/content/posts?page=1&limit=2')
            .set('x-user-id', 'test-user-123')
            .set('x-internal-secret', process.env.INTERNAL_SECRET);
        expect(res.statusCode).toBe(200);
        expect(res.body.posts.length).toBe(2);
        expect(res.body.posts[0].text).toBe('hello world 5')
        expect(res.body.posts[1].text).toBe('hello world 4')

    });

})
