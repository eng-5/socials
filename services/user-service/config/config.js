// config/config.js
require('dotenv').config();

const sslConfig = {
    require: true,
    rejectUnauthorized: false
}

module.exports = {
    development: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: sslConfig
        },
        ssl: true
    },
    test: {
        use_env_variable: 'DATABASE_URL_TEST',
        dialect: 'postgres',
        dialectOptions: {
            ssl: sslConfig
        },
        ssl: true
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: sslConfig
        },
        ssl: true
    }
};