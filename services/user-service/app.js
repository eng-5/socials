//  app.js
const express = require('express');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const verifyInternalSecret = require('./middleware/internalAuth');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'User service is running' });
});
app.use('/api/user/auth', verifyInternalSecret, authRouter)
app.use('/api/user', verifyInternalSecret, userRouter)

module.exports = app;