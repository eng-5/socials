// middleware/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Defense-in-depth: never trust headers a client could have set themselves
    delete req.headers['x-user-id'];
    delete req.headers['x-internal-secret'];

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.headers['x-user-id'] = decoded.id;
        req.headers['x-internal-secret'] = process.env.INTERNAL_SECRET;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }


}

module.exports = verifyToken;