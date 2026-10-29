import client from './client';

export const createPost = (text) => {
    return client.post('/api/content/posts', { text })
}

export const getAllPosts = (page = 1, limit = 20) => {
    return client.get(`/api/content/posts?page=${page}&limit=${limit}`);
}