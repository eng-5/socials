// controllers/errorController.js
// Global error handling middleware

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = Object.values(err.errors).map(e => e.message).join(', ')
        err.status = 'fail'
    }
    if (err.name === 'CastError') {
        err.statusCode = 400;
        err.status = 'fail';
        err.message = `Invalid ${err.path}: ${err.value}`;
    }
    let message = err.message;
    if (err.statusCode === 500) {
        message = 'internal server error';
    }
    if (req.log && typeof req.log.error === 'function') {
        req.log.error(err.stack);
    } else {
        console.error(err);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message
    });
}