// server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5002;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Content Service running on port ${PORT}`);
    });
}

)
