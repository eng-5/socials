// src/appi/client.js
import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Runs on every outgoing request - attaches the saved token, if one exists
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Runs on every incoming response - if token is invalid/expired anywhere,
// clear it and send the user back to login, instead of handling this in every component
client.interceptors.response.use((response) => response, (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/api/user/auth');
    if (error.response?.status === 401 && !isAuthEndpoint) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

export default client;