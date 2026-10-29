// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const verifyToken = require('./middleware/auth');
const { randomUUID } = require('crypto');
const pinoHttp = require('pino-http');

const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
app.use(limiter);

function attachRequestId(req, res, next) {
    req.requestId = randomUUID();
    req.headers['x-request-id'] = req.requestId;
    next();
}


app.use(attachRequestId);
app.use(pinoHttp({
    genReqId: (req) => req.headers['x-request-id'],
    redact: ['req.headers.authorization',
        'req.headers["x-internal-secret"]',
        'req.headers.cookie'
    ]
}))


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
app.use('/api/content', verifyToken, createProxyMiddleware({
    target: process.env.CONTENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/api/content/' }
}))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Api Gateway running on port ${PORT}`);
})
