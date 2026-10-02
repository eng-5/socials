// controllers/errorController.js
// Global error handling middleware

module.exports = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        err.statusCode = 400;
        err.message = Object.values(err.errors).map(e => e.message).join(', ')
        err.status = 'fail'
    }
    req.log.error(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}