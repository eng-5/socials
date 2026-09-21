// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const verifyToken = require('./middleware/auth');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ status: 'Gateway is running' }));
function injectInternalSecret(req, res, next) {
    req.headers['x-internal-secret'] = process.env.INTERNAL_SECRET;
    next();

}
function requireTokenForLogout(req, res, next) {
    if (req.path === '/logout') {
        return verifyToken(req, res, next);
    }
    next();
}
// Auth routes are public - you can't verify a JWT before you have one
app.use('/api/user/auth', injectInternalSecret, requireTokenForLogout, createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/user/auth/' }
}));

// Everything else requires a valid token first
app.use('/api/user', verifyToken, createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/user/' }
}))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
})