// server.js
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
// const User = require('./models/User'); // must import so sequelize knows about it before sync but since sync is not used we comment it out



const PORT = process.env.PORT || 5001;
// sync() creates the table if it doesn't exist yet, based on the model definition
// sequelize.sync().then(() => {
//     console.log('✅ User model synced to Postgress');
//     app.listen(PORT, () => {
//         console.log(`🚀 User service running on port ${PORT}`)
//     });
// }).catch((err) => {
//     console.error('❌ Failed to sync database:', err);
// })


// Confirm the DB connection works, then start listening - sync(), migrations own the schema now
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connected to postgres');
        app.listen(PORT, () => {
            console.log(`🚀 User service running on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.error('❌ Failed to connect database:', err);
    })