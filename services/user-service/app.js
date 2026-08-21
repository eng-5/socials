//  app.js
const express = require('express');
const authRouter = require('./routes/authRouter');
const verifyInternalSecret = require('./middleware/internalAuth');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'User service is running' });
});
app.use('/api/user/auth', verifyInternalSecret, authRouter)

module.exports = app;