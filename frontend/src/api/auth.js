// src/api/auth.js
import client from './client';

export const register = (username, email, password) => {
    return client.post('/api/user/auth/register', { username, email, password });
}

export const login = (email, password) => {
    return client.post('/api/user/auth/login', { email, password });
}