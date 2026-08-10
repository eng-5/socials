// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const isTest = process.env.NODE_ENV === 'test';
const connectionString = isTest ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Neon requires SSL
        },
    },
    logging: false, // set to console.log if you want to see raw SQL queries while learning

});

module.exports = sequelize;