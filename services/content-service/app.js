// app.js
const express = require('express');
const app = express();
const postRouter = require('./routes/postRouter');
const verifyInternalSecret = require('./middleware/internalAuth');
const globalErrorController = require('./controllers/errorController');


app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'Content service is running' });
})

app.use('/api/content/posts', verifyInternalSecret, postRouter);

app.use(globalErrorController);


module.exports = app;