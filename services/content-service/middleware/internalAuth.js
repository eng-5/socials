// middleware/internalAuth.js
function verifyInternalSecret(req, res, next) {
    const expected = process.env.INTERNAL_SECRET;
    const secret = req.headers['x-internal-secret'];

    // Fail closed: if this service has no secret configures, nobody gets in.
    // (without the !expected check, a missing env var and a missing 
    // header are both undefined, undefined is false, and the request passes.)
    if (!expected || secret !== expected) {
        return res.status(403).json({ error: 'Forbidden: direct access not allowed' });
    }
    next();
}
module.exports = verifyInternalSecret;