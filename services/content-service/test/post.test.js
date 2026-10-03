// test/post.test.js
require('dotenv').config();
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Content = require('../models/Content');


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

    it('rejects a post with text over 200 characters with 400', async () => {
        const res = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'test-user-123')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'a'.repeat(201) });

        expect(res.statusCode).toBe(400);
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

describe('GET /api/content/posts query validation', () => {
    it.each([
        'page=0', 'page=-1', 'page=abc', 'page=1.5',
        'limit=0', 'limit=51', 'limit=abc', 'limit=2.5',
    ])('rejects ?%s with 400', async (qs) => {
        const res = await request(app)
            .get(`/api/content/posts?${qs}`)
            .set('x-user-id', 'test-user-123')
            .set('x-internal-secret', process.env.INTERNAL_SECRET);

        expect(res.statusCode).toBe(400);
    });

    it('still works with no query params (defaults)', async () => {
        const res = await request(app)
            .get('/api/content/posts')
            .set('x-user-id', 'test-user-123')
            .set('x-internal-secret', process.env.INTERNAL_SECRET);

        expect(res.statusCode).toBe(200);
        expect(res.body.currentPage).toBe(1);
    });

})

describe('PATCH /api/content/posts/:id', () => {
    it('updates post when the author matches', async () => {
        const createRes = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'original' });

        const res = await request(app)
            .patch(`/api/content/posts/${createRes.body.post._id}`)
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'edited' });

        expect(res.statusCode).toBe(200);
        expect(res.body.post.text).toBe('edited');
    })
    it('rejects an edit from a different user with 403', async () => {
        const createRes = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'original' });

        const res = await request(app)
            .patch(`/api/content/posts/${createRes.body.post._id}`)
            .set('x-user-id', 'someone-else')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'Hijacked' });

        expect(res.statusCode).toBe(403);
    })
    it('returns 404 for a nonexistent post id', async () => {
        const fakedId = '507f1f77bcf86cd728704672' // valid looking Mongo ObjectId that doesn't exist 
        const res = await request(app)
            .patch(`/api/content/posts/${fakedId}`)
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'edited' })

        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /api/content/posts/:id', () => {
    it('deletes post when the author matches', async () => {
        const createRes = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'original' })

        const del = await request(app)
            .delete(`/api/content/posts/${createRes.body.post._id}`)
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)


        const getRes = await Content.findById(createRes.body.post._id)

        expect(del.statusCode).toBe(204)
        expect(getRes).toBeNull();
    })
    it('rejects a delete from a different user with 403', async () => {
        const createRes = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'original' })

        const del = await request(app)
            .delete(`/api/content/posts/${createRes.body.post._id}`)
            .set('x-user-id', 'someone-else')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)

        expect(del.statusCode).toBe(403)
    })
    it('returns 404 for a nonexistent post id', async () => {
        const fakedId = '507f1f77bcf86cd728704672' // valid looking Mongo ObjectId that doesn't exist 
        const createRes = await request(app)
            .post('/api/content/posts')
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)
            .send({ text: 'original' })

        const del = await request(app)
            .delete(`/api/content/posts/${fakedId}`)
            .set('x-user-id', 'author-1')
            .set('x-internal-secret', process.env.INTERNAL_SECRET)


        expect(del.statusCode).toBe(404)
    })
})
